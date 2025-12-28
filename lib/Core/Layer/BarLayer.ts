import type { BarData, Rect, Domain } from "../Types/types";
import { processBarData } from "../DataProcessor/Processor";
import { barPicker } from "../Picker/Picker";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import type { AnimationStage } from "../Types/types";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { ScaledLayer } from "./Interface/ScaledLayer";

import { BaseDataLayer } from "./BaseDataLayer";
import { registerLayer } from "./LayerRegistry";
import { resolveBarAnimationPolicies } from "../Defaults/resolves";
import type { Primitive } from "../Primitives/Primitives";

export class BarLayer
  extends BaseDataLayer<BarData, Rect>
  implements ScaledLayer
{
  public readonly id = "bars";

  constructor(policies: Record<AnimationStage, AnimationPolicy<Rect>>) {
    super(policies);
    this.picker = barPicker;
  }

  protected process(): Rect[] {
    return processBarData(this.rawData, this.scales);
  }

  computeDomain(): Domain | undefined {
    if (this.rawData.length === 0) return;

    const ys = this.rawData.map((d) => d.value);

    return {
      x: this.rawData.map((d) => d.label),
      y: [Math.min(0, ...ys), Math.max(0, ...ys)],
    };
  }

  setScales(scales: ScaleManager): void {
    super.setScales(scales);
  }

  getBaselineY(): number {
    return this.scales.get("y").map(0);
  }

  protected buildPrimitives(rects: Rect[]): Primitive[] {
    if (rects.length === 0) return [];

    const primitives: Primitive[] = [];

    rects.forEach((r, i) => {
      const isHovered = this.hovered === i;

      primitives.push({
        type: "rect",
        id: `bar:${i}`,
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

registerLayer(
  "bar",
  (options) => new BarLayer(resolveBarAnimationPolicies(options?.animation)),
);
