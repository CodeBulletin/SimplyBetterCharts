import type { PrimitiveStyle, PrimitiveType } from "./types";

export interface BasePrimitive {
  type: PrimitiveType;
  id?: string;
  zIndex?: number;
  style?: PrimitiveStyle;
  pickable?: boolean;
}

export interface PathPrimitive extends BasePrimitive {
  type: "path";
  d: string;
}

export interface RectPrimitive extends BasePrimitive {
  type: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CirclePrimitive extends BasePrimitive {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
}

export interface LinePrimitive extends BasePrimitive {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TextPrimitive extends BasePrimitive {
  type: "text";
  x: number;
  y: number;
  text: string;
  anchor: string;
}

export type Primitive =
  | PathPrimitive
  | RectPrimitive
  | CirclePrimitive
  | LinePrimitive
  | TextPrimitive;
