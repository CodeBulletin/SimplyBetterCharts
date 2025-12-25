// Core/Layer/ChartLayer.ts
import type { Picker } from "../Types/types";

export interface ChartLayer<T> {
  readonly id: string;
  readonly data: readonly T[];

  init(container: SVGSVGElement): void;
  draw(): void;

  getPicker(): Picker<T> | null;
  onHover(index: number | null): void;
}
