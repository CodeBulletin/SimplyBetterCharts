// Core/Engine/ChartEngine.ts
import type { AnyChartLayer } from "../Layer/AnyChartLayer";

// Core/Engine/ChartEngine.ts
export class ChartEngine {
  private layers: AnyChartLayer[] = [];
  private readonly container: SVGSVGElement;

  constructor(container: SVGSVGElement) {
    this.container = container;
  }

  addLayer(layer: AnyChartLayer) {
    this.layers.push(layer);
    layer.init(this.container);
  }

  draw() {
    for (const layer of this.layers) {
      layer.draw();
    }
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
}
