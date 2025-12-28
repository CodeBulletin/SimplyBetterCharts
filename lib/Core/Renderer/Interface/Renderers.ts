import type { Point, Rect } from "../../Types/types";

export interface Renderer<T> {
  init(container: SVGSVGElement): void;
  draw(data: T[], hovered: number | null): void;
  destroy(): void;
}

export interface BarRenderer extends Renderer<Rect> {
  init(container: SVGSVGElement): void;
  draw(data: Rect[], hovered: number | null): void;
  destroy(): void;
}

export interface LineRenderer extends Renderer<Point> {
  init(container: SVGSVGElement): void;
  draw(data: Point[], hovered: number | null): void;
  destroy(): void;
}

export interface AxisTick {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  lx: number;
  ly: number;
}

export interface AxisRenderData {
  axisLine: { x1: number; y1: number; x2: number; y2: number };
  ticks: AxisTick[];
}

export interface AxisRenderer extends Renderer<Rect> {
  init(svg: SVGSVGElement): void;
  render(data: AxisRenderData): void;
  destroy(): void;
}
