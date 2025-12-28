export type PrimitiveType = "path" | "rect" | "circle" | "line" | "text";

export interface PrimitiveStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
}
