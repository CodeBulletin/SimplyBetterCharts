// Core/Layer/AnyChartLayer.ts

export interface AnyChartLayer {
  readonly id: string;

  init(container: SVGSVGElement): void;
  draw(dt: number): boolean;

  /** returns null if layer is not pickable */
  pick(x: number, y: number): boolean;

  clearHover(): void;
  destroy(): void;
}
