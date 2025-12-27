import type { AxisRenderer, AxisRenderData } from "../Interface/Renderers";

export class SVGAxisRenderer implements AxisRenderer {
  private axis!: SVGLineElement;
  private ticksGroup!: SVGGElement;

  init(svg: SVGSVGElement): void {
    this.axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.axis.setAttribute("stroke", "#444");

    this.ticksGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    this.ticksGroup.setAttribute("stroke", "#444");
    this.ticksGroup.setAttribute("fill", "#444");
    this.ticksGroup.setAttribute("font-size", "11");

    svg.appendChild(this.axis);
    svg.appendChild(this.ticksGroup);
  }

  render(data: AxisRenderData): void {
    const { axisLine, ticks } = data;

    this.axis.setAttribute("x1", `${axisLine.x1}`);
    this.axis.setAttribute("y1", `${axisLine.y1}`);
    this.axis.setAttribute("x2", `${axisLine.x2}`);
    this.axis.setAttribute("y2", `${axisLine.y2}`);

    this.ticksGroup.innerHTML = "";

    for (const t of ticks) {
      // tick line
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("x1", `${t.x1}`);
      line.setAttribute("y1", `${t.y1}`);
      line.setAttribute("x2", `${t.x2}`);
      line.setAttribute("y2", `${t.y2}`);

      // label
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", `${t.lx}`);
      text.setAttribute("y", `${t.ly}`);
      text.setAttribute("text-anchor", "middle");
      text.textContent = t.label;

      this.ticksGroup.appendChild(line);
      this.ticksGroup.appendChild(text);
    }
  }

  destroy(): void {
    this.axis?.remove();
    this.ticksGroup?.remove();
  }
}
