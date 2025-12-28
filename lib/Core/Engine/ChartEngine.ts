import type { AnyChartLayer } from "../Layer/Interface/AnyChartLayer";
import type { ScaledLayer } from "../Layer/Interface/ScaledLayer";
import type { Primitive } from "../Primitives/Primitives";
import { ScaleManager } from "../Scales/ScaleManager";
import type { DomainValue, ScaleId } from "../Types/types";

const DEFAULT_MARGIN = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
};

export class ChartEngine {
  private layers: (AnyChartLayer & Partial<ScaledLayer>)[] = [];
  private dirty = true; // 🔑 start dirty
  readonly margin = DEFAULT_MARGIN;
  readonly scales: ScaleManager;
  private primitives: Primitive[] = [];

  constructor(width: number, height: number) {
    this.scales = new ScaleManager(this.margin);
    this.scales.setSize(width, height);
  }

  stop() {
    for (const layer of this.layers) {
      layer.destroy?.();
    }
    this.layers.length = 0;
    this.dirty = false;
  }

  addLayer(layer: AnyChartLayer & Partial<ScaledLayer>) {
    layer.setScales?.(this.scales);
    this.layers.push(layer);

    this.resolveDomains();

    for (const l of this.layers) {
      l.rescale?.();
    }

    this.markDirty();
  }

  reflow() {
    this.resolveDomains();
    for (const l of this.layers) {
      l.rescale?.();
    }
    this.markDirty();
  }

  markDirty() {
    this.dirty = true;
  }

  draw(dt: number): { primitives: Primitive[]; needsMore: boolean } {
    let stillAnimating = false;
    const scene: Primitive[] = [];

    for (const layer of this.layers) {
      stillAnimating = layer.draw(dt) || stillAnimating;

      const p = layer.getPrimitives();
      if (p && p.length) {
        scene.push(...p);
      }
    }

    // 🔑 Painter’s order: layers already added in z-order
    this.primitives = scene;

    return {
      primitives: scene,
      needsMore: stillAnimating,
    };
  }

  onPointerMove(x: number, y: number) {
    let hit = false;

    for (let i = this.layers.length - 1; i >= 0; i--) {
      if (this.layers[i].pick(x, y)) {
        hit = true;
        this.markDirty(); // 🔑 hover changed visuals
        break;
      }
    }

    if (!hit) {
      for (const layer of this.layers) {
        layer.clearHover();
      }
      this.markDirty();
    }
  }

  clearHover() {
    for (const layer of this.layers) {
      layer.clearHover();
    }
    this.markDirty();
  }

  private ensureScaleTypes(collected: Map<ScaleId, DomainValue[]>) {
    for (const [id, values] of collected) {
      // console.trace(id, values);
      const sample = values[0];

      if (id === "x" && collected.get("x")!.length > 1) {
        const kinds = collected
          .get("x")!
          .map((v) =>
            Array.isArray(v) && v.length === 2 && typeof v[0] === "number"
              ? "continuous"
              : "categorical",
          );

        if (new Set(kinds).size > 1) {
          throw new Error(
            "Incompatible x domains: cannot mix categorical and continuous x scales",
          );
        }
      }

      const isContinuous =
        Array.isArray(sample) &&
        sample.length === 2 &&
        typeof sample[0] === "number" &&
        typeof sample[1] === "number";

      if (id === "x") {
        if (isContinuous) {
          this.scales.useLinearX();
        } else {
          this.scales.useBandX();
        }
      }
    }
  }

  private applyDomains(collected: Map<ScaleId, DomainValue[]>) {
    for (const [id, values] of collected) {
      const scale = this.scales.get(id as ScaleId);

      const sample = values[0];

      const isContinuous =
        Array.isArray(sample) &&
        sample.length === 2 &&
        typeof sample[0] === "number" &&
        typeof sample[1] === "number";

      if (isContinuous) {
        // ✅ Continuous scale: stretch domain
        const mins = values.map((v) => (v as [number, number])[0]);
        const maxs = values.map((v) => (v as [number, number])[1]);

        scale.setDomain([Math.min(...mins), Math.max(...maxs)]);
      } else {
        // ✅ CATEGORICAL SCALE (THE FIX)
        // Flatten → dedupe → RESET domain
        const categories = Array.from(
          new Set(values.flat() as (string | number)[]),
        );

        scale.setDomain(categories);
      }
    }
  }

  private resolveDomains() {
    const collected = new Map<ScaleId, DomainValue[]>();

    // 1️⃣ collect all domains
    for (const layer of this.layers) {
      const domain = layer.computeDomain?.();
      if (!domain) continue;

      for (const [id, value] of Object.entries(domain)) {
        const arr = collected.get(id as ScaleId) ?? [];
        arr.push(value as DomainValue);
        collected.set(id as ScaleId, arr);
      }
    }

    // 2️⃣ decide scale TYPES first
    this.ensureScaleTypes(collected);

    // 3️⃣ apply domains
    this.applyDomains(collected);
  }
}
