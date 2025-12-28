import type { LineData, Point, Domain, ScaleId } from "../Types/types";
import { linePicker } from "../Picker/Picker";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import type { AnimationStage } from "../Types/types";
import type { ScaleManager } from "../Scales/ScaleManager";

import { BaseDataLayer } from "./BaseDataLayer";
import { registerLayerPlugin } from "./LayerRegistry";
import { resolveLineAnimationPolicies } from "../Defaults/resolves";
import type { Primitive } from "../Primitives/Primitives";
import type { LineLayerDescriptor } from "./LayerDescriptor";

export class LineLayer extends BaseDataLayer<LineData, Point> {
  public readonly id;
  protected xScaleId: ScaleId = "x:primary";
  protected yScaleId: ScaleId = "y:primary";

  constructor(
    id: string,
    policies: Record<AnimationStage, AnimationPolicy<Point>>,
  ) {
    super(policies);
    this.id = id;
    this.picker = linePicker;
  }

  /** convert raw data → render data */
  protected process(): Point[] {
    const x = this.getXContinuous();
    const y = this.getY();

    return this.rawData.map((d) => ({
      x: x.map(d.x as number),
      y: y.map(d.y),
    }));
  }

  protected buildPrimitives(points: Point[]): Primitive[] {
    if (points.length === 0) return [];

    const path = "M " + points.map((p) => `${p.x} ${p.y}`).join(" L ");
    const hovered = this.hovered !== null ? points[this.hovered] : null;

    const baseId = this.id; // 🔑 layer-scoped

    const primitives: Primitive[] = [
      {
        type: "path",
        id: `${baseId}:path`,
        d: path,
        style: {
          stroke: hovered ? "orange" : "steelblue",
          strokeWidth: hovered ? 4 : 2,
          fill: "none",
        },
        pickable: true,
        zIndex: 1,
      },
    ];

    if (hovered) {
      primitives.push({
        type: "circle",
        id: `${baseId}:hover`,
        cx: hovered.x,
        cy: hovered.y,
        r: 5,
        style: {
          fill: "orange",
          stroke: "white",
          strokeWidth: 2,
        },
        pickable: false,
        zIndex: 2,
      });
    }

    return primitives;
  }

  computeDomain(): Domain {
    const xs = this.rawData.map((d) => d.x);
    const ys = this.rawData.map((d) => d.y);

    return {
      [this.xScaleId]:
        typeof xs[0] === "number"
          ? [Math.min(...(xs as number[])), Math.max(...(xs as number[]))]
          : xs,
      [this.yScaleId]: [Math.min(...ys), Math.max(...ys)],
    };
  }

  setScales(scales: ScaleManager): void {
    super.setScales(scales);
  }

  getBaselineY(): number {
    return this.getY().map(0);
  }
}

registerLayerPlugin<LineLayerDescriptor>({
  type: "line",

  create(desc, ctx) {
    const layer = new LineLayer(
      desc.id,
      resolveLineAnimationPolicies(desc.options?.animation),
    );
    layer.setScales(ctx.scales);
    return layer;
  },

  setData(layer, desc) {
    (layer as LineLayer).setData(desc.data);
  },
});
