// Core/Engine/ChartEngine.ts
import type { AnyChartLayer } from "../Layer/AnyChartLayer";

// Core/Engine/ChartEngine.ts
export class ChartEngine {
  private layers: AnyChartLayer[] = [];
  private dirty = true; // 🔑 start dirty
  private readonly container: SVGSVGElement;

  constructor(container: SVGSVGElement) {
    this.container = container;
  }

  stop() {
    for (const layer of this.layers) {
      layer.destroy?.();
    }
  }

  addLayer(layer: AnyChartLayer) {
    this.layers.push(layer);
    layer.init(this.container);
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
}
