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

export type ScaleId =
  | "x"
  | "y"
  | "x:secondary"
  | "y:secondary"
  | `color:${string}`;

export type Domain = Partial<Record<ScaleId, any>>;
