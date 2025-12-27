import type { LineData, BarData, Point, Rect } from "../Types/types";
import type { ScaleManager } from "../Scales/ScaleManager";

export function processLineData(
  data: LineData[],
  scales: ScaleManager,
): Point[] {
  const x = scales.get("x");
  const y = scales.get("y");

  return data.map((d) => ({
    x: x.map(d.x),
    y: y.map(d.y),
  }));
}

export function processBarData(data: BarData[], scales: ScaleManager): Rect[] {
  const x = scales.get("x");
  const y = scales.get("y");

  if (!("bandwidth" in x)) {
    throw new Error("Bar chart requires a band scale on x axis");
  }

  const w = x.bandwidth as number;

  return data.map((d) => {
    const cx = x.map(d.label);

    const v0 = Math.min(0, d.value);
    const v1 = Math.max(0, d.value);

    const y0 = y.map(v1); // top of bar
    const y1 = y.map(v0); // bottom of bar

    return {
      x: cx - w / 2,
      y: y0,
      w,
      h: y1 - y0, // ALWAYS positive
    };
  });
}
