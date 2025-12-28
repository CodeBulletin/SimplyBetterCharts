import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type { ScaledLayer } from "./Interface/ScaledLayer";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { CategoricalDomain, ContinuousDomain } from "../Types/types";
import type { Primitive } from "../Primitives/Primitives";

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
  private orientation: "bottom" | "left";
  private ticks: AxisTick[] = [];
  private primitives: Primitive[] = [];

  constructor(orientation: "bottom" | "left") {
    this.orientation = orientation;
    this.id = `axis:${orientation}`;
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
  }

  private computeTicks(
    left: number,
    right: number,
    top: number,
    bottom: number,
  ): AxisTick[] {
    const scale =
      this.orientation === "bottom"
        ? this.scales.get("x")
        : this.scales.get("y");

    const ticks: AxisTick[] = [];

    const TICK_SIZE = 6;
    const LABEL_OFFSET = 14;
    const LINEAR_TICK_COUNT = 25;

    /* -----------------------------
       BAND SCALE (categorical)
    ------------------------------ */
    if ("domainValues" in scale) {
      for (const value of scale.domainValues as CategoricalDomain) {
        const p = scale.map(value);

        if (this.orientation === "bottom") {
          ticks.push({
            x1: p,
            y1: bottom,
            x2: p,
            y2: bottom - TICK_SIZE,
            lx: p,
            ly: bottom + LABEL_OFFSET,
            label: String(value),
          });
        } else {
          ticks.push({
            x1: left,
            y1: p,
            x2: left + TICK_SIZE,
            y2: p,
            lx: left - LABEL_OFFSET,
            ly: p + 4,
            label: String(value),
          });
        }
      }

      return ticks;
    }

    /* -----------------------------
       LINEAR SCALE (continuous)
    ------------------------------ */
    if ("domain" in scale) {
      const [d0, d1] = scale.domain as ContinuousDomain;
      const step = (d1 - d0) / (LINEAR_TICK_COUNT - 1);

      for (let i = 0; i < LINEAR_TICK_COUNT; i++) {
        const value = d0 + i * step;
        const p = scale.map(value);

        const label = Number.isInteger(value)
          ? String(value)
          : value.toFixed(2);

        if (this.orientation === "bottom") {
          ticks.push({
            x1: p,
            y1: bottom,
            x2: p,
            y2: bottom - TICK_SIZE,
            lx: p,
            ly: bottom + LABEL_OFFSET,
            label,
          });
        } else {
          ticks.push({
            x1: left,
            y1: p,
            x2: left + TICK_SIZE,
            y2: p,
            lx: left - LABEL_OFFSET,
            ly: p + 4,
            label,
          });
        }
      }
    }

    return ticks;
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
    if (this.orientation === "bottom") {
      primitives.push({
        type: "line",
        id: `${axisId}:line`,
        x1: left,
        y1: bottom,
        x2: right,
        y2: bottom,
        style: {
          stroke: "#444",
          strokeWidth: 1,
        },
        pickable: false,
        zIndex: 0,
      });
    } else {
      primitives.push({
        type: "line",
        id: `${axisId}:line`,
        x1: left,
        y1: top,
        x2: left,
        y2: bottom,
        style: {
          stroke: "#444",
          strokeWidth: 1,
        },
        pickable: false,
        zIndex: 0,
      });
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
        anchor: this.orientation === "bottom" ? "middle" : "end",
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

  clearHover(): void {}

  destroy(): void {}
}
