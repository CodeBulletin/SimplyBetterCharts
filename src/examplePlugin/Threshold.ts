import type { AnyChartLayer } from "../../lib/Core/Layer/Interface/AnyChartLayer";
import type { ScaledLayer } from "../../lib/Core/Layer/Interface/ScaledLayer";
import { registerLayerPlugin } from "../../lib/Core/Layer/LayerRegistry";
import type { Primitive } from "../../lib/Core/Primitives/Primitives";
import type { ScaleManager } from "../../lib/Core/Scales/ScaleManager";
import type { Domain, ScaleId } from "../../lib/Core/Types/types";

export type ThresholdLayerDescriptor = {
  id: string;
  type: "threshold";
  scaleId: ScaleId; // which scale to bind to
  value: number; // threshold value
  color?: string;
  width?: number;
  zIndex?: number;
};

export class ThresholdLayer implements AnyChartLayer, ScaledLayer {
  readonly id: string;

  private scaleId: ScaleId;
  private value: number;
  private color: string;
  private width: number;

  private scales?: ScaleManager;
  private primitives: Primitive[] = [];

  constructor(
    id: string,
    scaleId: ScaleId,
    value: number,
    color = "red",
    width = 2,
  ) {
    this.id = id;
    this.scaleId = scaleId;
    this.value = value;
    this.color = color;
    this.width = width;
  }

  init(): void {}

  setScales(scales: ScaleManager): void {
    this.scales = scales;
  }

  computeDomain(): Domain {
    return {
      [this.scaleId]: [this.value, this.value],
    };
  }

  rescale(): void {
    if (!this.scales) {
      // scales not wired yet
      this.primitives = [];
      return;
    }

    console.log("Draw Line!");

    if (!this.scales.has(this.scaleId)) {
      this.primitives = [];
      return;
    }

    const scale = this.scales.get(this.scaleId);
    const pos = scale.map(this.value);

    const { width, height, margins } = this.scales;

    const left = margins.left;
    const right = width - margins.right;
    const top = margins.top;
    const bottom = height - margins.bottom;

    // Horizontal or vertical depending on scale
    this.primitives = this.scaleId.startsWith("y")
      ? [
          {
            type: "line",
            id: `${this.id}:line`,
            x1: left,
            y1: pos,
            x2: right,
            y2: pos,
            style: {
              stroke: this.color,
              strokeWidth: this.width,
              opacity: 0.8,
            },
            pickable: false,
            zIndex: 5,
          },
        ]
      : [
          {
            type: "line",
            id: `${this.id}:line`,
            x1: pos,
            y1: top,
            x2: pos,
            y2: bottom,
            style: {
              stroke: this.color,
              strokeWidth: this.width,
              opacity: 0.8,
            },
            pickable: false,
            zIndex: 5,
          },
        ];
  }

  draw(): boolean {
    // static layer
    return false;
  }

  pick(): boolean {
    return false;
  }

  clearHover(): void {}

  destroy(): void {}

  getPrimitives(): Primitive[] {
    return this.primitives;
  }
}

registerLayerPlugin<ThresholdLayerDescriptor>({
  type: "threshold",

  create(desc, ctx) {
    const layer = new ThresholdLayer(
      desc.id,
      desc.scaleId,
      desc.value,
      desc.color,
      desc.width,
    ) as ThresholdLayer;
    layer.setScales(ctx.scales);
    return layer;
  },
});
