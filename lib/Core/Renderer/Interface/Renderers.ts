// Core/Renderer/BarRenderer.ts

import type { Point, Rect } from "../../Types/types";

export interface BarRenderer {
  init(container: SVGSVGElement): void;
  draw(data: Rect[], hovered: number | null): void;
}

export interface LineRenderer {
  init(container: SVGSVGElement): void;
  draw(data: Point[], hovered: number | null): void;
}
