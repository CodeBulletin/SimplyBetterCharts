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

  const w = x.bandwidth;

  return data.map((d) => {
    const cx = x.map(d.label);
    const top = y.map(d.value);
    const bottom = y.map(0);

    return {
      x: cx - w / 2,
      y: top,
      w,
      h: bottom - top,
    };
  });
}
