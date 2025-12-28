import type { EasingName } from "../Animation/helper";

export interface ChartOptions {
  margin?: Partial<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;

  animation?: AnimationOptions;
}

export interface AxisOptions {
  ticks?: number;
  tickSize?: number;
  tickPadding?: number;
  format?: (value: number | string) => string;
}

export type AnimationOptions =
  | {
      enabled: false;
    }
  | {
      enabled: true;
      duration?: number;
      easing?: EasingName;
    };

export type LineChartOptions = ChartOptions & {};
export type BarChartOptions = ChartOptions & {};
