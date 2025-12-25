// src/charts/processLineData.ts

import type { BarData, LineData, Point, Rect } from "../Types/types.d";
import { toNumber } from "../Helper/Helper";

export function processPointData<X extends number | Date>(
  data: LineData<X>[],
  width: number,
  height: number,
): Point[] {
  const xs = data.map((d) => toNumber(d.x));
  const ys = data.map((d) => d.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return data.map((d) => ({
    x: ((toNumber(d.x) - minX) / (maxX - minX)) * width,
    y: height - ((d.y - minY) / (maxY - minY)) * height,
  }));
}

export function processBarData(
  data: BarData[],
  width: number,
  height: number,
): Rect[] {
  const maxY = Math.max(...data.map((d) => d.value));
  const barWidth = width / data.length;

  return data.map((d, i) => {
    const h = (d.value / maxY) * height;
    return {
      x: i * barWidth + 2,
      y: height - h,
      w: barWidth - 4,
      h,
    };
  });
}
