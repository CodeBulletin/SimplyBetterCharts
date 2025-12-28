import type { Primitive } from "../../../Core/Primitives/Primitives";
import type { Renderer } from "../Renderer";

const SVG_NS = "http://www.w3.org/2000/svg";

export class SVGRenderer implements Renderer {
  private svg: SVGSVGElement;
  private elementMap = new Map<string, SVGElement>();

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
  }

  render(primitives: Primitive[]): void {
    const usedIds = new Set<string>();

    for (const primitive of primitives) {
      if (!primitive.id) {
        throw new Error("Primitive must have an id for SVG rendering");
      }

      usedIds.add(primitive.id);

      let el = this.elementMap.get(primitive.id);

      // 1️⃣ Create element if missing
      if (!el) {
        el = this.createElement(primitive);
        this.elementMap.set(primitive.id, el);
        this.svg.appendChild(el);
      }

      // 2️⃣ Update element attributes/styles
      this.updateElement(el, primitive);
    }

    // 3️⃣ Remove unused elements
    for (const [id, el] of this.elementMap) {
      if (!usedIds.has(id)) {
        el.remove();
        this.elementMap.delete(id);
      }
    }

    // 4️⃣ Ensure correct order (painter’s model)
    this.reorder(primitives);
  }

  destroy(): void {
    for (const el of this.elementMap.values()) {
      el.remove();
    }
    this.elementMap.clear();
  }

  // -----------------------------
  // Internals
  // -----------------------------

  private createElement(p: Primitive): SVGElement {
    switch (p.type) {
      case "path":
        return document.createElementNS(SVG_NS, "path");
      case "rect":
        return document.createElementNS(SVG_NS, "rect");
      case "circle":
        return document.createElementNS(SVG_NS, "circle");
      case "line":
        return document.createElementNS(SVG_NS, "line");
      case "text":
        return document.createElementNS(SVG_NS, "text");
      default:
        throw new Error(`Unsupported primitive type: ${p.type as never}`);
    }
  }

  private updateElement(el: SVGElement, p: Primitive): void {
    // Geometry
    switch (p.type) {
      case "path": {
        const path = el as SVGPathElement;
        path.setAttribute("d", p.d);
        break;
      }

      case "rect": {
        const r = el as SVGRectElement;
        r.setAttribute("x", `${p.x}`);
        r.setAttribute("y", `${p.y}`);
        r.setAttribute("width", `${p.w}`);
        r.setAttribute("height", `${p.h}`);
        // if (p.radius !== undefined) {
        //   r.setAttribute("rx", `${p.radius}`);
        //   r.setAttribute("ry", `${p.radius}`);
        // }
        break;
      }

      case "circle": {
        const c = el as SVGCircleElement;
        c.setAttribute("cx", `${p.cx}`);
        c.setAttribute("cy", `${p.cy}`);
        c.setAttribute("r", `${p.r}`);
        break;
      }

      case "line": {
        const l = el as SVGLineElement;
        l.setAttribute("x1", `${p.x1}`);
        l.setAttribute("y1", `${p.y1}`);
        l.setAttribute("x2", `${p.x2}`);
        l.setAttribute("y2", `${p.y2}`);
        break;
      }

      case "text": {
        const t = el as SVGTextElement;
        t.setAttribute("x", `${p.x}`);
        t.setAttribute("y", `${p.y}`);
        t.textContent = p.text;
        if (p.anchor) {
          t.setAttribute("text-anchor", p.anchor);
        }
        break;
      }
    }

    // Style
    const style = p.style;
    if (style) {
      if (style.fill !== undefined) el.setAttribute("fill", style.fill);
      if (style.stroke !== undefined) el.setAttribute("stroke", style.stroke);
      if (style.strokeWidth !== undefined)
        el.setAttribute("stroke-width", `${style.strokeWidth}`);
      if (style.opacity !== undefined)
        el.setAttribute("opacity", `${style.opacity}`);
    }

    // Interaction hint (engine-owned semantics)
    if (p.pickable === false) {
      el.style.pointerEvents = "none";
    } else {
      el.style.pointerEvents = "";
    }
  }

  private reorder(primitives: Primitive[]) {
    for (const p of primitives) {
      const el = this.elementMap.get(p.id!);
      if (el) {
        this.svg.appendChild(el);
      }
    }
  }
}
