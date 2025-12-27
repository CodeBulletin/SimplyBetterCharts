import type { AnyChartLayer } from "../Layer/Interface/AnyChartLayer";
import type { ScaledLayer } from "../Layer/Interface/ScaledLayer";
import { ScaleManager } from "../Scales/ScaleManager";

export class ChartEngine {
  private layers: (AnyChartLayer & Partial<ScaledLayer>)[] = [];
  private dirty = true; // 🔑 start dirty
  private readonly container: SVGSVGElement;
  readonly scales = new ScaleManager();

  constructor(container: SVGSVGElement, width: number, height: number) {
    this.container = container;
    this.scales.setSize(width, height);
  }

  stop() {
    for (const layer of this.layers) {
      layer.destroy?.();
    }
  }

  addLayer(layer: AnyChartLayer & Partial<ScaledLayer>) {
    layer.setScales?.(this.scales);
    this.layers.push(layer);
    layer.init(this.container);

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

  draw(dt: number): boolean {
    if (!this.dirty) return false;

    let stillAnimating = false;

    for (const layer of this.layers) {
      // layer.draw returns whether it is still animating
      stillAnimating = layer.draw(dt) || stillAnimating;
    }

    // keep drawing if animation is active
    this.dirty = stillAnimating;

    return this.dirty;
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

  private ensureScaleTypes(collected: Map<string, any[]>) {
    for (const [id, values] of collected) {
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

  private applyDomains(collected: Map<string, any[]>) {
    for (const [id, values] of collected) {
      const scale = this.scales.get(id as any);

      const sample = values[0];

      const isContinuous =
        Array.isArray(sample) &&
        sample.length === 2 &&
        typeof sample[0] === "number";

      if (isContinuous) {
        // continuous
        const mins = values.map((v) => v[0]);
        const maxs = values.map((v) => v[1]);
        scale.setDomain([Math.min(...mins), Math.max(...maxs)]);
      } else {
        // categorical
        scale.setDomain([...new Set(values.flat())]);
      }
    }
  }

  private resolveDomains() {
    const collected = new Map<string, any[]>();

    // 1️⃣ collect all domains
    for (const layer of this.layers) {
      const domain = layer.computeDomain?.();
      if (!domain) continue;

      for (const [id, value] of Object.entries(domain)) {
        const arr = collected.get(id) ?? [];
        arr.push(value);
        collected.set(id, arr);
      }
    }

    // 2️⃣ decide scale TYPES first
    this.ensureScaleTypes(collected);

    // 3️⃣ apply domains
    this.applyDomains(collected);
  }
}
