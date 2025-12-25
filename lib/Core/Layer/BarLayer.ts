import type { AnyChartLayer } from "./AnyChartLayer";
import type { Rect, BarData } from "../Types/types";
import { processBarData } from "../DataProcessor/Processor";
import { barPicker } from "../Picker/Picker";
import type { BarRenderer } from "../Renderer/Interface/Renderers";
import { easeOutCubic } from "../Animation/lerp";

export class BarLayer implements AnyChartLayer {
  readonly id = "bars";

  private data: Rect[] = [];
  private hovered: number | null = null;
  private animT = 0;

  private readonly renderer: BarRenderer;
  private readonly width: number;
  private readonly height: number;

  constructor(renderer: BarRenderer, width: number, height: number) {
    this.renderer = renderer;
    this.width = width;
    this.height = height;
  }

  init(svg: SVGSVGElement) {
    this.renderer.init(svg);
  }

  setData(data: BarData[]) {
    this.data = processBarData(data, this.width, this.height);
    this.animT = 0;
  }

  draw() {
    this.animT = Math.min(1, this.animT + 0.05);
    const t = easeOutCubic(this.animT);

    const animated: Rect[] = this.data.map((r) => ({
      ...r,
      y: this.height - r.h * t,
      h: r.h * t,
    }));

    this.renderer.draw(animated, this.hovered);
  }

  pick(x: number, y: number): boolean {
    const i = barPicker(this.data, x, y);
    if (i !== null) {
      this.hovered = i;
      return true;
    }
    return false;
  }

  clearHover() {
    this.hovered = null;
  }
}
