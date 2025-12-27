import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type { ScaledLayer } from "./Interface/ScaledLayer";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { AxisRenderer, AxisTick } from "../Renderer/Interface/Renderers";

export class AxisLayer implements AnyChartLayer, ScaledLayer {
  readonly id: string;
  private scales!: ScaleManager;
  private renderer: AxisRenderer;
  private orientation: "bottom" | "left";

  constructor(orientation: "bottom" | "left", renderer: AxisRenderer) {
    this.orientation = orientation;
    this.renderer = renderer;
    this.id = `axis:${orientation}`;
  }

  init(svg: SVGSVGElement): void {
    this.renderer.init(svg);
  }

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

    if (this.orientation === "bottom") {
      this.renderer.render({
        axisLine: { x1: left, y1: bottom, x2: right, y2: bottom },
        ticks,
      });
    } else {
      this.renderer.render({
        axisLine: { x1: left, y1: top, x2: left, y2: bottom },
        ticks,
      });
    }
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
      for (const value of scale.domainValues) {
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
      const [d0, d1] = scale.domain;
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

  draw(): boolean {
    return false;
  }

  pick(): boolean {
    return false;
  }

  clearHover(): void {}

  destroy(): void {
    this.renderer.destroy();
  }
}
