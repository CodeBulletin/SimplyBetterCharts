import type { AnyChartLayer } from "../Core/Layer/AnyChartLayer";

export type GraphFactory = (width: number, height: number) => AnyChartLayer;
