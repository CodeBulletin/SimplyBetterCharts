// Core/Layer/LayerDescriptor.ts

import type { LineChartOptions } from "../Types/lib";
import type { BarData, LineData, ScaleId } from "../Types/types";

export interface BaseLayerDescriptor {
  id: string;
  type: string;
  zIndex?: number;
}

export type LayerDescriptor = BaseLayerDescriptor & Record<string, unknown>;

export interface AxisLayerDescriptor extends BaseLayerDescriptor {
  type: "axis";
  orientation: "left" | "right" | "top" | "bottom";
  scaleId: ScaleId;
}

export interface LineLayerDescriptor extends BaseLayerDescriptor {
  type: "line";
  data: LineData[];
  options?: LineChartOptions;
}

export interface BarLayerDescriptor extends BaseLayerDescriptor {
  type: "bar";
  data: BarData[];
  options?: LineChartOptions;
}
