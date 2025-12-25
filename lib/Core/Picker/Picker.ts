import type { Picker, Point, Rect } from "../Types/types";

export const linePicker: Picker<Point> = (points, x, y) => {
  let min = Infinity;
  let index: number | null = null;

  for (let i = 0; i < points.length; i++) {
    const dx = points[i].x - x;
    const dy = points[i].y - y;
    const d = dx * dx + dy * dy;

    if (d < min) {
      min = d;
      index = i;
    }
  }
  return index;
};

export const barPicker: Picker<Rect> = (rects, x, y) => {
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
      return i;
    }
  }
  return null;
};
