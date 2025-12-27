import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type { Rect, BarData, Picker, Domain } from "../Types/types";
import { processBarData } from "../DataProcessor/Processor";
import { barPicker } from "../Picker/Picker";
import type { BarRenderer } from "../Renderer/Interface/Renderers";
import type { ChartLayer } from "./Interface/ChartLayer";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import { AnimationController } from "../Animation/AnimationController";
import type { ScaledLayer } from "./Interface/ScaledLayer";
import type { ScaleManager } from "../Scales/ScaleManager";

export class BarLayer implements AnyChartLayer, ChartLayer<Rect>, ScaledLayer {
  readonly id = "bars";

  private rawData: BarData[] = [];
  private data: Rect[] = [];
  private from: Rect[] = [];
  private hovered: number | null = null;
  private picker: Picker<Rect> = barPicker;

  private readonly renderer: BarRenderer;

  private first: boolean;
  private readonly policy: AnimationPolicy<Rect>;
  private readonly anim = new AnimationController();
  private scales!: ScaleManager;

  constructor(renderer: BarRenderer, policy: AnimationPolicy<Rect>) {
    this.renderer = renderer;
    this.policy = policy;
    this.first = true;
  }

  init(svg: SVGSVGElement) {
    this.renderer.init(svg);
  }

  setData(data: BarData[]) {
    this.rawData = data;
  }

  rescale(): void {
    if (!this.scales) return;
    const next = processBarData(this.rawData, this.scales);

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

  setScales(scales: ScaleManager): void {
    this.scales = scales;
  }

  computeDomain(): Domain {
    return {
      x: this.rawData.map((d) => d.label),
      y: [0, Math.max(...this.rawData.map((d) => d.value))],
    };
  }
}
