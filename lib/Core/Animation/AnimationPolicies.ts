import type { AnimationPolicy } from "./AnimationPolicy";
import type { EasingFn, Point } from "../Types/types";
import { lerp, easeOutCubic } from "./helper";
import type { AnimationContext } from "./AnimationContext";
import type { Rect } from "../Types/types";

export class LineBaselinePolicy implements AnimationPolicy<Point> {
  duration = 0.4;
  easingFn: EasingFn;

  constructor(duration: number, easingFn: EasingFn) {
    this.duration = duration;
    this.easingFn = easingFn;
  }

  ease(t: number) {
    return this.easingFn(t);
  }

  start(next: Point[], ctx: AnimationContext): Point[] {
    return next.map((p) => ({
      x: p.x,
      y: ctx.height, // baseline
    }));
  }

  interpolate(from: Point[], to: Point[], t: number): Point[] {
    return to.map((p, i) => ({
      x: lerp(from[i].x, p.x, t),
      y: lerp(from[i].y, p.y, t),
    }));
  }
}

export class LineUpdatePolicy implements AnimationPolicy<Point> {
  duration = 0.4;
  easingFn: EasingFn;

  constructor(duration: number, easingFn: EasingFn) {
    this.duration = duration;
    this.easingFn = easingFn;
  }

  ease(t: number) {
    return this.easingFn(t);
  }

  start(next: Point[], ctx: AnimationContext): Point[] {
    // Start from previous rendered data
    return (ctx.previous as Point[]) ?? next;
  }

  interpolate(from: Point[], to: Point[], t: number): Point[] {
    return to.map((p, i) => {
      const q = from[i] ?? p;
      return {
        x: lerp(q.x, p.x, t),
        y: lerp(q.y, p.y, t),
      };
    });
  }
}

export class BarGrowPolicy implements AnimationPolicy<Rect> {
  readonly duration = 0.4;

  ease(t: number) {
    return easeOutCubic(t);
  }

  start(next: Rect[], ctx: AnimationContext): Rect[] {
    return next.map((r) => ({
      ...r,
      y: ctx.height,
      h: 0,
    }));
  }

  interpolate(from: Rect[], to: Rect[], t: number): Rect[] {
    return to.map((r, i) => {
      const q = from[i] ?? r;
      return {
        ...r,
        y: lerp(q.y, r.y, t),
        h: lerp(q.h, r.h, t),
      };
    });
  }
}

export class NoAnimationPolicy<T> implements AnimationPolicy<T> {
  readonly duration = 0;

  ease(): number {
    return 1;
  }

  start(next: T[]): T[] {
    return next;
  }

  interpolate(_: T[], to: T[]): T[] {
    return to;
  }
}

export class BarUpdatePolicy implements AnimationPolicy<Rect> {
  readonly duration = 0.35;

  ease(t: number) {
    return easeOutCubic(t);
  }

  start(next: Rect[], ctx: AnimationContext<Rect>): Rect[] {
    const prev = (ctx.previous as Rect[]) ?? [];

    return next.map((r, i) => {
      const p = prev[i];

      // Existing bar → animate from previous rect
      if (p) return p;

      // New bar → grow from baseline
      return {
        ...r,
        y: ctx.height,
        h: 0,
      };
    });
  }

  interpolate(from: Rect[], to: Rect[], t: number): Rect[] {
    return to.map((r, i) => {
      const f = from[i] ?? r;

      return {
        x: lerp(f.x, r.x, t),
        y: lerp(f.y, r.y, t),
        w: lerp(f.w, r.w, t),
        h: lerp(f.h, r.h, t),
      };
    });
  }
}
