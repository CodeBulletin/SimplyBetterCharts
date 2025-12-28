import type { EasingName } from "../Animation/helper";

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Picker<T> = (data: T[], x: number, y: number) => number | null;

export type RendererType =
  | "svg"
  | "webgl"
  | "webgl-3d"
  | "webgpu"
  | "webgpu-3d";

export type BarData = {
  label: string | number;
  value: number;
};

export type LineData = {
  x: number | string;
  y: number;
};

type AnimationStage = "initial" | "update";

export type ScaleId =
  | "x:primary"
  | "y:primary"
  | "x:secondary"
  | "y:secondary"
  | `color:${string}`;

export type ContinuousDomain = [number, number];
export type CategoricalDomain = (string | number)[];
export type DomainValue = ContinuousDomain | CategoricalDomain;

export type Domain = Partial<Record<ScaleId, DomainValue>>;

export type EasingFn = (t: number) => number;

export type ResolvedAnimationOptions = {
  enabled: true;
  duration: number;
  easing: EasingName;
};

export type ResolvedLineOptions = {
  renderer: RendererType;
  animation: ResolvedAnimationOptions;
};
