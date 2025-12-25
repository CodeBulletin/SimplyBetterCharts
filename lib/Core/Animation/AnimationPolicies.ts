import type { AnimationPolicy } from "./AnimationPolicy";
import type { Point } from "../Types/types";
import { lerp, easeOutCubic } from "./helper";
import type { AnimationContext } from "./AnimationContext";
import type { Rect } from "../Types/types";

export class LineBaselinePolicy implements AnimationPolicy<Point> {
  readonly duration = 0.4;

  ease(t: number) {
    return easeOutCubic(t);
  }

  start(next: Point[], ctx: AnimationContext): Point[] {
    return next.map((p) => ({
      x: p.x,
      y: ctx.height,
    }));
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

export class LineUpdatePolicy implements AnimationPolicy<Point> {
  readonly duration = 0.3;

  ease(t: number) {
    return easeOutCubic(t);
  }

  start(next: Point[], ctx: AnimationContext): Point[] {
    return ctx.isFirstRender ? next : [];
  }

  interpolate(from: Point[], to: Point[], t: number): Point[] {
    if (!from.length) return to;
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
