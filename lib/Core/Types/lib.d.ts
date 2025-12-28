import type { EasingName } from "../Animation/helper";
import type { RendererType } from "./types";

export interface ChartOptions {
  width: number;
  height: number;

  margin?: Partial<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;

  renderer?: RendererType;
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

export interface LineStyle {
  stroke?: string;
  strokeWidth?: number;
}

export interface BarStyle {
  fill?: string;
  radius?: number;
}

export type LineChartOptions = ChartOptions & {};
export type BarChartOptions = ChartOptions & {};
