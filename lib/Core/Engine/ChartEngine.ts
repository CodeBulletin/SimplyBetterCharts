import type { AnyChartLayer } from "../Layer/Interface/AnyChartLayer";
import type { ScaledLayer } from "../Layer/Interface/ScaledLayer";
import type { LayerDescriptor } from "../Layer/LayerDescriptor";
import { getLayerPlugin } from "../Layer/LayerRegistry";
import type { Primitive } from "../Primitives/Primitives";
import { ScaleManager } from "../Scales/ScaleManager";
import type { DomainValue, ScaleId } from "../Types/types";

const DEFAULT_MARGIN = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
};

function isContinuousDomain(v: DomainValue): v is [number, number] {
  return (
    Array.isArray(v) &&
    v.length === 2 &&
    typeof v[0] === "number" &&
    typeof v[1] === "number"
  );
}

export class ChartEngine {
  readonly margin = DEFAULT_MARGIN;
  readonly scales: ScaleManager;
  private primitives: Primitive[] = [];
  private layers: (AnyChartLayer & Partial<ScaledLayer>)[] = [];
  private layerMap = new Map<string, AnyChartLayer>();
  onInvalidate?: () => void;

  constructor(width: number, height: number) {
    this.scales = new ScaleManager(this.margin);
    this.scales.setSize(width, height);
  }

  stop() {
    for (const layer of this.layers) {
      layer.destroy?.();
    }
    this.layers.length = 0;
  }

  setLayers(descriptors: LayerDescriptor[]) {
    const alive = new Set<string>();

    const ordered = [...descriptors].sort(
      (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0),
    );

    for (const desc of ordered) {
      let layer = this.layerMap.get(desc.id);
      alive.add(desc.id);

      const plugin = getLayerPlugin(desc.type);
      if (!layer) {
        layer = plugin.create(desc as any, {
          scales: this.scales,
        });

        this.layerMap.set(desc.id, layer);
        this.layers.push(layer);
      }

      plugin.setData?.(layer, desc as any);
    }

    for (const [id, layer] of this.layerMap) {
      if (!alive.has(id)) {
        this.destroyLayer(layer);
      }
    }

    this.reflow();
    this.onInvalidate?.();
  }

  private destroyLayer(layer: AnyChartLayer) {
    layer.destroy?.();
    this.layerMap.delete(layer.id);
    this.layers = this.layers.filter((l) => l !== layer);
  }

  reflow() {
    this.resolveDomains();
    for (const l of this.layers) {
      l.rescale?.();
    }
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
      primitives: this.primitives,
      needsMore: stillAnimating,
    };
  }

  onPointerMove(x: number, y: number) {
    let hit = false;

    for (let i = this.layers.length - 1; i >= 0; i--) {
      if (this.layers[i].pick(x, y)) {
        hit = true;
        break;
      }
    }

    if (!hit) {
      for (const layer of this.layers) {
        layer.clearHover();
      }
    }
  }

  clearHover() {
    for (const layer of this.layers) {
      layer.clearHover();
    }
  }

  private resolveDomains() {
    const collected = new Map<ScaleId, DomainValue[]>();

    /* ----------------------------------
       1️⃣ Collect domains from layers
    ---------------------------------- */
    for (const layer of this.layers) {
      const domain = layer.computeDomain?.();
      if (!domain) continue;

      for (const [id, value] of Object.entries(domain)) {
        const key = id as ScaleId;
        const arr = collected.get(key) ?? [];
        arr.push(value as DomainValue);
        collected.set(key, arr);
      }
    }

    /* ----------------------------------
       2️⃣ Resolve scales WITH domains
    ---------------------------------- */
    for (const [id, values] of collected) {
      if (values.length === 0) continue;

      const kinds = values.map((v) =>
        isContinuousDomain(v) ? "continuous" : "categorical",
      );

      if (new Set(kinds).size > 1) {
        throw new Error(`Incompatible domains for scale "${id}"`);
      }

      const kind = kinds[0];

      const scale =
        kind === "continuous"
          ? this.scales.createLinear(id)
          : this.scales.createBand(id);

      if (kind === "continuous") {
        const mins = values.map((v) => (v as [number, number])[0]);
        const maxs = values.map((v) => (v as [number, number])[1]);

        scale.setDomain([Math.min(...mins), Math.max(...maxs)]);
      } else {
        const categories = Array.from(
          new Set(values.flat() as (string | number)[]),
        );

        scale.setDomain(categories);
      }

      this.scales.applyRange(id);
    }
  }
}
