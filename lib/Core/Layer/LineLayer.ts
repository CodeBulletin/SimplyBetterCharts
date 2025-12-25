import type { AnyChartLayer } from "./AnyChartLayer";
import type { Point, LineData, Picker } from "../Types/types";
import { processPointData } from "../DataProcessor/Processor";
import { linePicker } from "../Picker/Picker";
import type { LineRenderer } from "../Renderer/Interface/Renderers";
import type { ChartLayer } from "./ChartLayer";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import { AnimationController } from "../Animation/AnimationController";

export class LineLayer implements AnyChartLayer, ChartLayer<Point> {
  readonly id = "line";

  private data: Point[] = [];
  private from: Point[] = [];

  private hovered: number | null = null;

  private picker: Picker<Point> = linePicker;

  private readonly renderer: LineRenderer;
  private readonly width: number;
  private readonly height: number;

  private first: boolean;
  private readonly policy: AnimationPolicy<Point>;
  private readonly anim = new AnimationController();

  constructor(
    renderer: LineRenderer,
    width: number,
    height: number,
    policy: AnimationPolicy<Point>,
  ) {
    this.renderer = renderer;
    this.width = width;
    this.height = height;
    this.policy = policy;
    this.first = true;
  }

  init(svg: SVGSVGElement) {
    this.renderer.init(svg);
  }

  setData(data: LineData[]) {
    const next = processPointData(data, this.width, this.height);

    this.from = this.policy.start(next, {
      width: this.width,
      height: this.height,
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

  clearHover() {
    this.hovered = null;
  }
}
