import type { LineData, Point, Domain } from "../Types/types";
import { processLineData } from "../DataProcessor/Processor";
import { linePicker } from "../Picker/Picker";
import type { LineRenderer } from "../Renderer/Interface/Renderers";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import type { AnimationStage } from "../Types/types";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { ScaledLayer } from "./Interface/ScaledLayer";

import { BaseDataLayer } from "./BaseDataLayer";
import { registerLayer } from "./LayerRegistry";
import {
  resolveLineAnimationPolicies,
  resolveLineRenderer,
} from "../Defaults/resolves";

export class LineLayer
  extends BaseDataLayer<LineData, Point>
  implements ScaledLayer
{
  public readonly id = "line";

  constructor(
    renderer: LineRenderer,
    policies: Record<AnimationStage, AnimationPolicy<Point>>,
  ) {
    super(renderer, policies);
    this.picker = linePicker;
  }

  /** convert raw data → render data */
  protected process(): Point[] {
    return processLineData(this.rawData, this.scales);
  }

  protected rendererDraw(data: Point[], hovered: number | null): void {
    this.renderer.draw(data, hovered);
  }

  computeDomain(): Domain | undefined {
    if (this.rawData.length === 0) return;

    const firstX = this.rawData[0].x;

    if (typeof firstX === "string") {
      const ys = this.rawData.map((d) => d.y);
      return {
        x: this.rawData.map((d) => d.x),
        y: [Math.min(...ys), Math.max(...ys)],
      };
    }

    const xs = this.rawData.map((d) => d.x as number);
    const ys = this.rawData.map((d) => d.y);

    return {
      x: [Math.min(...xs), Math.max(...xs)],
      y: [Math.min(...ys), Math.max(...ys)],
    };
  }

  setScales(scales: ScaleManager): void {
    super.setScales(scales);
  }
}

registerLayer(
  "line",
  (options) =>
    new LineLayer(
      resolveLineRenderer(options?.renderer),
      resolveLineAnimationPolicies(options?.animation),
    ),
);
