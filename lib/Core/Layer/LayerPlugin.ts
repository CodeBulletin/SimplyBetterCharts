import type { AnyChartLayer } from "./Interface/AnyChartLayer";
import type { ScaleManager } from "../Scales/ScaleManager";

export interface LayerPlugin<D extends { id: string }> {
  readonly type: string;

  create(
    descriptor: D,
    ctx: {
      scales: ScaleManager;
    },
  ): AnyChartLayer;

  setData?(layer: AnyChartLayer, descriptor: D): void;
}
