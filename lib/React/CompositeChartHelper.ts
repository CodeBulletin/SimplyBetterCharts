import type { LineData, BarData } from "../Core/Types/types";
import type { LineChartOptions, BarChartOptions } from "../Core/Types/lib";

export type LayerDescriptor =
  | {
      id?: string;
      type: "line";
      data: LineData[];
      options?: LineChartOptions;
      zIndex?: number;
    }
  | {
      id?: string;
      type: "bar";
      data: BarData[];
      options?: BarChartOptions;
      zIndex?: number;
    };
