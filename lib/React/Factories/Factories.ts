// React/factories/createBarRenderer.ts
import { SVGBarRenderer } from "../../Core/Renderer/SVG/SVGBarRenderer";
import { SVGLineRenderer } from "../../Core/Renderer/SVG/SVGLineRenderer";
import type {
  AxisRenderer,
  BarRenderer,
  LineRenderer,
} from "../../Core/Renderer/Interface/Renderers";
import type { RendererType } from "../../Core/Types/types";
import { SVGAxisRenderer } from "../../Core/Renderer/SVG/SVGAxisRenderer";

export function createBarRenderer(type: RendererType): BarRenderer {
  switch (type) {
    case "svg":
      return new SVGBarRenderer();

    case "webgl":
      // future
      // return new WebGLBarRenderer();
      throw new Error("WebGL BarRenderer not implemented");

    case "webgpu":
    case "webgpu-3d":
      throw new Error("WebGPU BarRenderer not implemented");

    default:
      throw new Error("Unkown Renderer");
  }
}

export function createLineRenderer(type: RendererType): LineRenderer {
  switch (type) {
    case "svg":
      return new SVGLineRenderer();

    case "webgl":
    case "webgpu":
    case "webgpu-3d":
      throw new Error("Renderer not implemented");

    default:
      throw new Error("Unkown Renderer");
  }
}

export function createAxisRenderer(type: RendererType): AxisRenderer {
  switch (type) {
    case "svg":
      return new SVGAxisRenderer();

    case "webgl":
    case "webgpu":
    case "webgpu-3d":
      throw new Error("Renderer not implemented");

    default:
      throw new Error("Unkown Renderer");
  }
}
