import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type { Point, LineData, Picker, Domain } from "../Types/types";
import { processLineData } from "../DataProcessor/Processor";
import { linePicker } from "../Picker/Picker";
import type { LineRenderer } from "../Renderer/Interface/Renderers";
import type { ChartLayer } from "./Interface/ChartLayer";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import { AnimationController } from "../Animation/AnimationController";
import type { ScaledLayer } from "./Interface/ScaledLayer";
import type { ScaleManager } from "../Scales/ScaleManager";

export class LineLayer
  implements AnyChartLayer, ChartLayer<Point>, ScaledLayer
{
  readonly id = "line";

  private rawData: LineData[] = [];
  private data: Point[] = [];
  private from: Point[] = [];

  private hovered: number | null = null;

  private picker: Picker<Point> = linePicker;

  private readonly renderer: LineRenderer;

  private first: boolean;
  private readonly policy: AnimationPolicy<Point>;
  private readonly anim = new AnimationController();
  private scales!: ScaleManager;

  constructor(renderer: LineRenderer, policy: AnimationPolicy<Point>) {
    this.renderer = renderer;
    this.policy = policy;
    this.first = true;
  }

  init(svg: SVGSVGElement) {
    this.renderer.init(svg);
  }

  setData(data: LineData[]) {
    this.rawData = data;
  }

  rescale() {
    if (!this.scales) return;

    const next = processLineData(this.rawData, this.scales);
    const zeroY = this.scales.get("y").map(0);

    this.from = this.policy.start(next, {
      width: this.scales.width,
      height: zeroY,
      isFirstRender: this.first,
    });

    this.data = next;
    this.anim.start();
    this.first = false;
  }

  setPicker(picker: Picker<Point>): void {
    this.picker = picker;
  }

  draw(dt: number): boolean {
    if (this.anim.active) {
      const rawT = this.anim.update(dt, this.policy.duration);
      const t = this.policy.ease(rawT);

      const frame = this.policy.interpolate(this.from, this.data, t);

      this.renderer.draw(frame, this.hovered);
      return true;
    }

    this.renderer.draw(this.data, this.hovered);
    return false;
  }

  getPicker(): Picker<Point> | null {
    return this.picker;
  }

  pick(x: number, y: number): boolean {
    const i = this.picker(this.data, x, y);
    if (i !== null) {
      this.hovered = i;
      return true;
    }
    return false;
  }

  destroy(): void {
    this.renderer.destroy();
  }

  clearHover(): void {
    this.hovered = null;
  }

  computeDomain(): Domain {
    if (typeof this.rawData[0]?.x === "string") {
      return {
        x: this.rawData.map((d) => d.x),
        y: [0, Math.max(...this.rawData.map((d) => d.y))],
      };
    }

    const xs = this.rawData.map((d) => d.x as number);
    return {
      x: [Math.min(...xs), Math.max(...xs)],
      y: [0, Math.max(...this.rawData.map((d) => d.y))],
    };
  }

  setScales(scales: ScaleManager): void {
    this.scales = scales;
  }
}
