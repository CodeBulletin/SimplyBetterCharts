// Renderer/SVG/SVGBarRenderer.ts

import type { Rect } from "../../Types/types.d";
import type { BarRenderer } from "../Interface/Renderers";

export class SVGBarRenderer implements BarRenderer {
  private group!: SVGGElement;
  private rects: SVGRectElement[] = [];

  init(svg: SVGSVGElement) {
    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(this.group);
  }

  destroy() {
    this.group?.remove();
  }

  draw(data: Rect[], hovered: number | null) {
    if (!this.group) return;
    while (this.rects.length < data.length) {
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("fill", "steelblue");
      this.group.appendChild(r);
      this.rects.push(r);
    }

    data.forEach((d, i) => {
      const r = this.rects[i];
      r.setAttribute("x", `${d.x}`);
      r.setAttribute("y", `${d.y}`);
      r.setAttribute("width", `${d.w}`);
      r.setAttribute("height", `${d.h}`);
      r.setAttribute("fill", hovered === i ? "orange" : "steelblue");
    });
  }
}
