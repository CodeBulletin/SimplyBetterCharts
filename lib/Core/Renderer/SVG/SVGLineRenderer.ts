import type { Point } from "../../Types/types";
import type { LineRenderer } from "../Interface/Renderers";

export class SVGLineRenderer implements LineRenderer {
  private path!: SVGPathElement;
  private hoverCircle!: SVGCircleElement;

  private cx = 0;
  private cy = 0;

  init(svg: SVGSVGElement) {
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("fill", "none");
    this.path.setAttribute("stroke-width", "2");
    svg.appendChild(this.path);

    this.hoverCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.hoverCircle.setAttribute("r", "5");
    this.hoverCircle.setAttribute("fill", "orange");
    this.hoverCircle.setAttribute("stroke", "white");
    this.hoverCircle.setAttribute("stroke-width", "2");
    this.hoverCircle.style.display = "none";

    svg.appendChild(this.hoverCircle);
  }

  destroy(): void {
    this.path?.remove();
    this.hoverCircle?.remove();
  }

  draw(data: Point[], hovered: number | null) {
    if (!this.path || data.length === 0) return;

    const d = "M " + data.map((p) => `${p.x} ${p.y}`).join(" L ");
    this.path.setAttribute("d", d);

    if (hovered !== null) {
      const p = data[hovered];

      this.cx += (p.x - this.cx) * 0.2;
      this.cy += (p.y - this.cy) * 0.2;

      this.hoverCircle.setAttribute("cx", `${this.cx}`);
      this.hoverCircle.setAttribute("cy", `${this.cy}`);
      this.hoverCircle.style.display = "block";
      this.path.setAttribute("stroke-width", "4");
      this.path.setAttribute("stroke", "orange");
    } else {
      this.hoverCircle.style.display = "none";
      this.path.setAttribute("stroke-width", "2");
      this.path.setAttribute("stroke", "blue");
    }
  }
}
