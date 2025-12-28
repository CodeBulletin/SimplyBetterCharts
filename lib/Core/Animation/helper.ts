export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function linear(t: number): number {
  return t;
}

export const EASING_MAP = {
  linear,
  easeOutCubic,
} as const;

export type EasingName = keyof typeof EASING_MAP;
