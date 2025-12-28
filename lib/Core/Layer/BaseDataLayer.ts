import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type { AnimationStage, Picker } from "../Types/types";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import { AnimationController } from "../Animation/AnimationController";
import type { ScaledLayer } from "./Interface/ScaledLayer";
import type { ScaleManager } from "../Scales/ScaleManager";
import type { DataLayer } from "./Interface/DataLayer";
import type { Renderer } from "../Renderer/Interface/Renderers";

export abstract class BaseDataLayer<TData, TRender>
  implements AnyChartLayer, ScaledLayer, DataLayer<TData>
{
  protected rawData: TData[] = [];
  protected data: TRender[] = [];
  protected from: TRender[] = [];
  protected hovered: number | null = null;

  protected first = true;
  protected renderer: Renderer<TRender>;
  protected policies: Record<AnimationStage, AnimationPolicy<TRender>>;
  protected anim = new AnimationController();
  protected scales!: ScaleManager;
  protected currentPolicy!: AnimationPolicy<TRender>;
  protected picker!: Picker<TRender>;

  public abstract readonly id: string;
  protected abstract process(): TRender[];
  protected abstract rendererDraw(
    data: TRender[],
    hovered: number | null,
  ): void;

  constructor(
    renderer: Renderer<TRender>,
    policies: Record<AnimationStage, AnimationPolicy<TRender>>,
  ) {
    this.renderer = renderer;
    this.policies = policies;
    this.first = true;
  }

  init(svg: SVGSVGElement) {
    this.renderer.init(svg);
  }

  setData(data: TData[]) {
    this.rawData = data;
  }

  setScales(scales: ScaleManager) {
    this.scales = scales;
  }

  setPicker(picker: Picker<TRender>): void {
    this.picker = picker;
  }

  getPicker(): Picker<TRender> | null {
    return this.picker;
  }

  rescale() {
    if (!this.scales || this.rawData.length === 0) return;

    const next = this.process();
    const stage = this.first ? "initial" : "update";
    const policy = this.policies[stage];

    this.from = policy.start(next, {
      width: this.scales.width,
      height: this.getBaselineY(),
      isFirstRender: this.first,
      previous: this.data,
    });

    this.currentPolicy = policy;
    this.data = next;
    this.anim.start();
  }

  draw(dt: number): boolean {
    if (this.anim.active) {
      const rawT = this.anim.update(dt, this.currentPolicy.duration);
      const t = this.currentPolicy.ease(rawT);
      const frame = this.currentPolicy.interpolate(this.from, this.data, t);
      this.rendererDraw(frame, this.hovered);
      if (rawT > 0) this.first = false;
      return true;
    }

    this.rendererDraw(this.data, this.hovered);
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

  clearHover() {
    this.hovered = null;
  }

  protected getBaselineY(): number {
    return this.scales.height;
  }
}
