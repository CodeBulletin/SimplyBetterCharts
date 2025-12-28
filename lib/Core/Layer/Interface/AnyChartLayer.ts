import type { Primitive } from "../../Primitives/Primitives";

export interface AnyChartLayer {
  readonly id: string;

  init(container: SVGSVGElement): void;
  draw(dt: number): boolean;

  /** returns null if layer is not pickable */
  pick(x: number, y: number): boolean;

  rescale(): void;

  clearHover(): void;
  destroy(): void;

  getPrimitives(): Primitive[];
}
