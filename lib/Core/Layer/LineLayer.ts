import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type {
  Point,
  LineData,
  Picker,
  Domain,
  AnimationStage,
} from "../Types/types";
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
  private readonly policies: Record<AnimationStage, AnimationPolicy<Point>>;
  private currentPolicy!: AnimationPolicy<Point>;

  private readonly anim = new AnimationController();
  private scales!: ScaleManager;

  constructor(
    renderer: LineRenderer,
    policies: Record<AnimationStage, AnimationPolicy<Point>>,
  ) {
    this.renderer = renderer;
    this.policies = policies;
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

    const stage = this.first ? "initial" : "update";

    const policy = this.policies[stage];

    console.log("stage:", stage, "from equals to?", this.from === this.data);

    this.from = policy.start(next, {
      width: this.scales.width,
      height: zeroY,
      isFirstRender: this.first,
      previous: this.data,
    });

    this.currentPolicy = policy;

    this.data = next;
    this.anim.start();
  }

  setPicker(picker: Picker<Point>): void {
    this.picker = picker;
  }

  draw(dt: number): boolean {
    if (this.anim.active) {
      const rawT = this.anim.update(dt, this.currentPolicy.duration);
      const t = this.currentPolicy.ease(rawT);

      const frame = this.currentPolicy.interpolate(this.from, this.data, t);

      this.renderer.draw(frame, this.hovered);

      if (this.first && rawT > 0) {
        this.first = false;
      }

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
      const ys = this.rawData.map((d) => d.y);
      return {
        x: this.rawData.map((d) => d.x),
        y: [Math.min(...ys), Math.max(...ys)],
      };
    }

    const xs = this.rawData.map((d) => d.x as number);
    const ys = this.rawData.map((d) => d.y as number);
    return {
      x: [Math.min(...xs), Math.max(...xs)],
      y: [Math.min(...ys), Math.max(...ys)],
    };
  }

  setScales(scales: ScaleManager): void {
    this.scales = scales;
  }
}
