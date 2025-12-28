import type { BarData, Rect, Domain } from "../Types/types";
import { processBarData } from "../DataProcessor/Processor";
import { barPicker } from "../Picker/Picker";
import type { BarRenderer } from "../Renderer/Interface/Renderers";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import type { AnimationStage } from "../Types/types";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { ScaledLayer } from "./Interface/ScaledLayer";

import { BaseDataLayer } from "./BaseDataLayer";
import { registerLayer } from "./LayerRegistry";
import {
  resolveBarAnimationPolicies,
  resolveBarRenderer,
} from "../Defaults/resolves";

export class BarLayer
  extends BaseDataLayer<BarData, Rect>
  implements ScaledLayer
{
  public readonly id = "bars";

  constructor(
    renderer: BarRenderer,
    policies: Record<AnimationStage, AnimationPolicy<Rect>>,
  ) {
    super(renderer, policies);
    this.picker = barPicker;
  }

  protected process(): Rect[] {
    return processBarData(this.rawData, this.scales);
  }

  protected rendererDraw(data: Rect[], hovered: number | null): void {
    this.renderer.draw(data, hovered);
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
}

registerLayer(
  "bar",
  (options) =>
    new BarLayer(
      resolveBarRenderer(options?.renderer),
      resolveBarAnimationPolicies(options?.animation),
    ),
);
