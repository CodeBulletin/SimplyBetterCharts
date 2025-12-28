import type { BarData, Rect, Domain, ScaleId } from "../Types/types";
import { barPicker } from "../Picker/Picker";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import type { AnimationStage } from "../Types/types";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { ScaledLayer } from "./Interface/ScaledLayer";

import { BaseDataLayer } from "./BaseDataLayer";
import { resolveBarAnimationPolicies } from "../Defaults/resolves";
import type { Primitive } from "../Primitives/Primitives";
import { registerLayerPlugin } from "./LayerRegistry";
import type { BarLayerDescriptor } from "./LayerDescriptor";

export class BarLayer
  extends BaseDataLayer<BarData, Rect>
  implements ScaledLayer
{
  public readonly id;
  protected xScaleId: ScaleId = "x:primary";
  protected yScaleId: ScaleId = "y:primary";

  constructor(
    id: string,
    policies: Record<AnimationStage, AnimationPolicy<Rect>>,
  ) {
    super(policies);
    this.id = id;
    this.picker = barPicker;
  }

  protected process(): Rect[] {
    const x = this.getXCategorical<string | number>();
    const y = this.getY();

    if (!x.bandwidth) {
      throw new Error("BarLayer requires band scale on X");
    }

    const w = x.bandwidth;

    return this.rawData.map((d) => {
      const cx = x.map(d.label);
      const y0 = y.map(Math.max(0, d.value));
      const y1 = y.map(Math.min(0, d.value));

      return {
        x: cx - w / 2,
        y: y0,
        w,
        h: y1 - y0,
      };
    });
  }

  computeDomain(): Domain {
    const ys = this.rawData.map((d) => d.value);
    return {
      [this.xScaleId]: this.rawData.map((d) => d.label),
      [this.yScaleId]: [Math.min(0, ...ys), Math.max(0, ...ys)],
    };
  }

  setScales(scales: ScaleManager): void {
    super.setScales(scales);
  }

  getBaselineY(): number {
    return this.getY().map(0);
  }

  protected buildPrimitives(rects: Rect[]): Primitive[] {
    if (rects.length === 0) return [];

    const primitives: Primitive[] = [];
    const baseId = this.id; // 🔑 layer-scoped

    rects.forEach((r, i) => {
      const isHovered = this.hovered === i;

      primitives.push({
        type: "rect",
        id: `${baseId}:${i}`,
        x: r.x,
        y: r.y,
        w: r.w,
        h: r.h,
        style: {
          fill: isHovered ? "orange" : "steelblue",
        },
        pickable: true,
        zIndex: 1,
      });
    });

    return primitives;
  }
}

registerLayerPlugin<BarLayerDescriptor>({
  type: "bar",

  create(desc, ctx) {
    const layer = new BarLayer(
      desc.id,
      resolveBarAnimationPolicies(desc.options?.animation),
    );
    layer.setScales(ctx.scales);
    return layer;
  },

  setData(layer, desc) {
    (layer as BarLayer).setData(desc.data);
  },
});
