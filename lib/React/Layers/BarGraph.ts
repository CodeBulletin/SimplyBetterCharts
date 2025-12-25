import { NoAnimationPolicy } from "../../Core/Animation/AnimationPolicies";
import { BarLayer } from "../../Core/Layer/BarLayer";
import { SVGBarRenderer } from "../../Core/Renderer/SVG/SVGBarRenderer";
import type { BarData } from "../../Core/Types/types";
import type { GraphFactory } from "../types";

export function BarGraph(data: BarData[]): GraphFactory {
  return (width: number, height: number) => {
    const layer = new BarLayer(
      new SVGBarRenderer(),
      width,
      height,
      new NoAnimationPolicy(),
    );
    layer.setData(data);
    return layer;
  };
}
