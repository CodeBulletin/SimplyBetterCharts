import { NoAnimationPolicy } from "../../Core/Animation/AnimationPolicies";
import { BarLayer } from "../../Core/Layer/BarLayer";
import { SVGBarRenderer } from "../../Core/Renderer/SVG/SVGBarRenderer";
import type { ScaleManager } from "../../Core/Scales/ScaleManager";
import type { BarData } from "../../Core/Types/types";
import type { GraphFactory } from "../types";

export function BarGraph(data: BarData[]): GraphFactory {
  return (scales: ScaleManager) => {
    const layer = new BarLayer(new SVGBarRenderer(), new NoAnimationPolicy());
    layer.setScales(scales);
    layer.setData(data);
    return layer;
  };
}
