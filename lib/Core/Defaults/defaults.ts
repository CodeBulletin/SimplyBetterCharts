import type { AxisOptions } from "../Types/lib";
import type { ResolvedAnimationOptions } from "../Types/types";

export const DEFAULT_MARGIN = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
};

export const DEFAULT_ANIMATION: ResolvedAnimationOptions = {
  enabled: true,
  duration: 0.3,
  easing: "easeOutCubic",
};

export const DEFAULT_2D_RENDERER = "svg";

export const DEFAULT_AXIS: Required<AxisOptions> = {
  ticks: 5,
  tickSize: 6,
  tickPadding: 4,
  format: (v) => String(v),
};
