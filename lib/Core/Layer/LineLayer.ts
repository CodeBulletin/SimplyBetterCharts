import type { LineData, Point, Domain } from "../Types/types";
import { processLineData } from "../DataProcessor/Processor";
import { linePicker } from "../Picker/Picker";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import type { AnimationStage } from "../Types/types";
import type { ScaleManager } from "../Scales/ScaleManager";

import { BaseDataLayer } from "./BaseDataLayer";
import { registerLayer } from "./LayerRegistry";
import { resolveLineAnimationPolicies } from "../Defaults/resolves";
import type { Primitive } from "../Primitives/Primitives";

export class LineLayer extends BaseDataLayer<LineData, Point> {
  public readonly id = "line";

  constructor(policies: Record<AnimationStage, AnimationPolicy<Point>>) {
    super(policies);
    this.picker = linePicker;
  }

  /** convert raw data → render data */
  protected process(): Point[] {
    return processLineData(this.rawData, this.scales);
  }

  protected buildPrimitives(points: Point[]): Primitive[] {
    if (points.length === 0) return [];

    const path = "M " + points.map((p) => `${p.x} ${p.y}`).join(" L ");

    const hovered = this.hovered !== null ? points[this.hovered] : null;

    const primitives: Primitive[] = [
      {
        type: "path",
        id: "line:path",
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

    // Optional hover marker
    if (hovered) {
      primitives.push({
        type: "circle",
        id: "line:hover",
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
  (options) => new LineLayer(resolveLineAnimationPolicies(options?.animation)),
);
