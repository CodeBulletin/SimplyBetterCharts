import type { AnyChartLayer } from "./AnyChartLayer";
import type { Rect, BarData, Picker } from "../Types/types";
import { processBarData } from "../DataProcessor/Processor";
import { barPicker } from "../Picker/Picker";
import type { BarRenderer } from "../Renderer/Interface/Renderers";
import type { ChartLayer } from "./ChartLayer";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import { AnimationController } from "../Animation/AnimationController";

export class BarLayer implements AnyChartLayer, ChartLayer<Rect> {
  readonly id = "bars";

  private data: Rect[] = [];
  private from: Rect[] = [];
  private hovered: number | null = null;
  private picker: Picker<Rect> = barPicker;

  private readonly renderer: BarRenderer;
  private readonly width: number;
  private readonly height: number;

  private first: boolean;
  private readonly policy: AnimationPolicy<Rect>;
  private readonly anim = new AnimationController();

  constructor(
    renderer: BarRenderer,
    width: number,
    height: number,
    policy: AnimationPolicy<Rect>,
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

  setData(data: BarData[]) {
    const next = processBarData(data, this.width, this.height);

    this.from = this.policy.start(next, {
      width: this.width,
      height: this.height,
      isFirstRender: this.first,
    });

    this.data = next;
    this.anim.start();
    this.first = false;
  }

  setPicker(picker: Picker<Rect>): void {
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

  destroy(): void {
    this.renderer.destroy();
  }

  pick(x: number, y: number): boolean {
    const i = this.picker(this.data, x, y);
    if (i !== null) {
      this.hovered = i;
      return true;
    }
    return false;
  }

  getPicker(): Picker<Rect> | null {
    return this.picker;
  }

  clearHover() {
    this.hovered = null;
  }
}
