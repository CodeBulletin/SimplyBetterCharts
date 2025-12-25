import type { AnimationContext } from "./AnimationContext";

export interface AnimationPolicy<T> {
  readonly duration: number;

  ease(t: number): number;

  start(next: T[], context: AnimationContext): T[];

  interpolate(from: T[], to: T[], t: number): T[];
}
