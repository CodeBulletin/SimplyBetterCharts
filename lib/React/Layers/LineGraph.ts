import { NoAnimationPolicy } from "../../Core/Animation/AnimationPolicies";
import { LineLayer } from "../../Core/Layer/LineLayer";
import { SVGLineRenderer } from "../../Core/Renderer/SVG/SVGLineRenderer";
import type { LineData } from "../../Core/Types/types";
import type { GraphFactory } from "../types";

export function LineGraph(data: LineData[]): GraphFactory {
  return (width: number, height: number) => {
    const layer = new LineLayer(
      new SVGLineRenderer(),
      width,
      height,
      new NoAnimationPolicy(),
    );
    layer.setData(data);
    return layer;
  };
}
