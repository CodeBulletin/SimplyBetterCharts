import type { AnyChartLayer } from "./AnyChartLayer";
import type { Point, LineData } from "../Types/types";
import { processPointData } from "../DataProcessor/Processor";
import { linePicker } from "../Picker/Picker";
import type { LineRenderer } from "../Renderer/Interface/Renderers";
import { lerp, easeOutCubic } from "../Animation/lerp";

export class LineLayer implements AnyChartLayer {
  readonly id = "line";

  private data: Point[] = [];
  private prevData: Point[] | null = null;
  private hovered: number | null = null;
  private animT = 1;

  private readonly renderer: LineRenderer;
  private readonly width: number;
  private readonly height: number;

  constructor(renderer: LineRenderer, width: number, height: number) {
    this.renderer = renderer;
    this.width = width;
    this.height = height;
  }

  init(svg: SVGSVGElement) {
    this.renderer.init(svg);
  }

  setData(data: LineData[]) {
    const next = processPointData(data, this.width, this.height);

    this.prevData = this.data.length ? this.data : next;
    this.data = next;
    this.animT = 0;
  }

  draw() {
    if (this.prevData && this.animT < 1) {
      this.animT = Math.min(1, this.animT + 0.05);
      const t = easeOutCubic(this.animT);

      const interpolated: Point[] = this.data.map((p, i) => {
        const q = this.prevData![i] ?? p;
        return {
          x: lerp(q.x, p.x, t),
          y: lerp(q.y, p.y, t),
        };
      });

      this.renderer.draw(interpolated, this.hovered);
    } else {
      this.renderer.draw(this.data, this.hovered);
    }
  }

  pick(x: number, y: number): boolean {
    const i = linePicker(this.data, x, y);
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
