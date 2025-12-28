import type { AnyChartLayer } from "../Core/Layer/AnyChartLayer";
import type { ScaleManager } from "../Core/Scales/ScaleManager";

export interface GraphFactory<TData = unknown> {
  id: string;
  create(scales: ScaleManager): AnyChartLayer;
  data(): TData[];
}
