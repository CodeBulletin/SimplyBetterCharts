import {
  BarGrowPolicy,
  LineBaselinePolicy,
  LineUpdatePolicy,
  NoAnimationPolicy,
} from "../Animation/AnimationPolicies";
import type { AnimationPolicy } from "../Animation/AnimationPolicy";
import { EASING_MAP } from "../Animation/helper";
import type { AnimationOptions, LineStyle } from "../Types/lib";
import type {
  Point,
  Rect,
  // RendererType,
  ResolvedAnimationOptions,
} from "../Types/types";
import {
  // DEFAULT_2D_RENDERER,
  DEFAULT_ANIMATION,
  DEFAULT_LINE_STYLE,
} from "./defaults";

export function resolveLineStyle(style?: LineStyle): Required<LineStyle> {
  return {
    ...DEFAULT_LINE_STYLE,
    ...style,
  };
}

export function resolveAnimationOptions(
  options?: AnimationOptions,
): ResolvedAnimationOptions | { enabled: false } {
  if (options?.enabled === false) {
    return { enabled: false };
  }

  return {
    enabled: true,
    duration: options?.duration ?? DEFAULT_ANIMATION.duration,
    easing: options?.easing ?? DEFAULT_ANIMATION.easing,
  };
}

export function resolveLineAnimationPolicies(options?: AnimationOptions): {
  initial: AnimationPolicy<Point>;
  update: AnimationPolicy<Point>;
} {
  const anim = resolveAnimationOptions(options);
  if (anim.enabled === false) {
    const policy = new NoAnimationPolicy<Point>();
    return { initial: policy, update: policy };
  }

  const easingFn = EASING_MAP[anim.easing];

  return {
    initial: new LineBaselinePolicy(anim.duration, easingFn),
    update: new LineUpdatePolicy(anim.duration, easingFn),
  };
}

export function resolveBarAnimationPolicies(options?: AnimationOptions): {
  initial: AnimationPolicy<Rect>;
  update: AnimationPolicy<Rect>;
} {
  const anim = resolveAnimationOptions(options);

  if (anim.enabled === false) {
    const policy = new NoAnimationPolicy<Rect>();
    return { initial: policy, update: policy };
  }

  // Bars usually only grow on enter
  return {
    initial: new BarGrowPolicy(),
    update: new NoAnimationPolicy<Rect>(),
  };
}
