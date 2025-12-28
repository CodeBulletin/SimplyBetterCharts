import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type { ScaledLayer } from "./Interface/ScaledLayer";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { ScaleId } from "../Types/types";
import type { Primitive } from "../Primitives/Primitives";
import { registerLayerPlugin } from "./LayerRegistry";
import type { AxisLayerDescriptor } from "./LayerDescriptor";

type AxisTick = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lx: number;
  ly: number;
  label: string;
};

export class AxisLayer implements AnyChartLayer, ScaledLayer {
  readonly id: string;
  private scales!: ScaleManager;
  private orientation: "left" | "right" | "bottom" | "top";
  private ticks: AxisTick[] = [];
  private primitives: Primitive[] = [];
  private scaleId: ScaleId;

  constructor(
    orientation: "left" | "right" | "bottom" | "top",
    scaleId: ScaleId,
    id: string,
  ) {
    this.orientation = orientation;
    this.scaleId = scaleId;
    this.id = `axis:${id}:${scaleId}:${orientation}`;
  }

  init(): void {}

  setScales(scales: ScaleManager): void {
    this.scales = scales;
  }

  rescale(): void {
    const { width, height, margins } = this.scales;

    const left = margins.left;
    const right = width - margins.right;
    const top = margins.top;
    const bottom = height - margins.bottom;

    const ticks = this.computeTicks(left, right, top, bottom);

    this.ticks = ticks;

    this.primitives = this.buildPrimitives();
  }

  private computeTicks(
    left: number,
    right: number,
    top: number,
    bottom: number,
  ): AxisTick[] {
    if (!this.scales.has(this.scaleId)) return [];
    const scale = this.scales.get(this.scaleId);

    if (!scale.ticks) return [];

    const ticks = scale.ticks(5);

    return ticks.map((t) => {
      switch (this.orientation) {
        case "bottom":
          return {
            x1: t.position,
            y1: bottom,
            x2: t.position,
            y2: bottom - 6,
            lx: t.position,
            ly: bottom + 14,
            label: t.label,
          };

        case "top":
          return {
            x1: t.position,
            y1: top,
            x2: t.position,
            y2: top + 6,
            lx: t.position,
            ly: top - 8,
            label: t.label,
          };

        case "left":
          return {
            x1: left,
            y1: t.position,
            x2: left + 6,
            y2: t.position,
            lx: left - 10,
            ly: t.position + 4,
            label: t.label,
          };

        case "right":
          return {
            x1: right,
            y1: t.position,
            x2: right - 6,
            y2: t.position,
            lx: right + 10,
            ly: t.position + 4,
            label: t.label,
          };
      }
    });
  }

  private buildPrimitives(): Primitive[] {
    if (!this.scales) return [];

    const { width, height, margins } = this.scales;

    const left = margins.left;
    const right = width - margins.right;
    const top = margins.top;
    const bottom = height - margins.bottom;

    const primitives: Primitive[] = [];

    const axisId = this.id;

    /* -----------------------------
       Axis main line
    ------------------------------ */
    switch (this.orientation) {
      case "bottom":
        primitives.push({
          type: "line",
          id: `${axisId}:line`,
          x1: left,
          y1: bottom,
          x2: right,
          y2: bottom,
          style: { stroke: "#444", strokeWidth: 1 },
          pickable: false,
          zIndex: 0,
        });
        break;

      case "top":
        primitives.push({
          type: "line",
          id: `${axisId}:line`,
          x1: left,
          y1: top,
          x2: right,
          y2: top,
          style: { stroke: "#444", strokeWidth: 1 },
          pickable: false,
          zIndex: 0,
        });
        break;

      case "left":
        primitives.push({
          type: "line",
          id: `${axisId}:line`,
          x1: left,
          y1: top,
          x2: left,
          y2: bottom,
          style: { stroke: "#444", strokeWidth: 1 },
          pickable: false,
          zIndex: 0,
        });
        break;

      case "right":
        primitives.push({
          type: "line",
          id: `${axisId}:line`,
          x1: right,
          y1: top,
          x2: right,
          y2: bottom,
          style: { stroke: "#444", strokeWidth: 1 },
          pickable: false,
          zIndex: 0,
        });
        break;
    }

    /* -----------------------------
       Ticks + labels
    ------------------------------ */
    this.ticks.forEach((t, i) => {
      // Tick line
      primitives.push({
        type: "line",
        id: `${axisId}:tick:${i}`,
        x1: t.x1,
        y1: t.y1,
        x2: t.x2,
        y2: t.y2,
        style: {
          stroke: "#444",
          strokeWidth: 1,
        },
        pickable: false,
        zIndex: 0,
      });

      // Tick label
      primitives.push({
        type: "text",
        id: `${axisId}:label:${i}`,
        x: t.lx,
        y: t.ly,
        text: t.label,
        anchor:
          this.orientation === "bottom" || this.orientation === "top"
            ? "middle"
            : this.orientation === "left"
              ? "end"
              : "start",

        style: {
          fill: "#444",
          fontSize: 11,
        },
        pickable: false,
        zIndex: 0,
      });
    });

    return primitives;
  }

  draw(): boolean {
    this.primitives = this.buildPrimitives();
    return false; // axes are static (for now)
  }

  getPrimitives(): Primitive[] {
    return this.primitives;
  }

  pick(): boolean {
    return false;
  }

  getScaleIds(): ScaleId[] {
    return [this.scaleId];
  }

  clearHover(): void {}

  destroy(): void {}
}

registerLayerPlugin<AxisLayerDescriptor>({
  type: "axis",

  create(desc, ctx) {
    const layer = new AxisLayer(desc.orientation, desc.scaleId, desc.id);
    layer.setScales(ctx.scales);
    return layer;
  },
});
