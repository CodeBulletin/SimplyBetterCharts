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
  label: string | number | Date;
  value: number;
};

export type XValue = number | Date;

export type LineData<X extends XValue = number> = {
  x: X;
  y: number;
};
