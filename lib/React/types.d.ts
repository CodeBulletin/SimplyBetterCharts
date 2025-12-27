import type { AnyChartLayer } from "../Core/Layer/AnyChartLayer";
import type { ScaleManager } from "../Core/Scales/ScaleManager";

export type GraphFactory = (scales: ScaleManager) => AnyChartLayer;
