import { NoAnimationPolicy } from "../../Core/Animation/AnimationPolicies";
import { LineLayer } from "../../Core/Layer/LineLayer";
import { SVGLineRenderer } from "../../Core/Renderer/SVG/SVGLineRenderer";
import type { ScaleManager } from "../../Core/Scales/ScaleManager";
import type { LineData } from "../../Core/Types/types";
import type { GraphFactory } from "../types";

export function LineGraph(data: LineData[]): GraphFactory {
  return (scales: ScaleManager) => {
    const layer = new LineLayer(new SVGLineRenderer(), new NoAnimationPolicy());
    layer.setScales(scales);
    layer.setData(data);
    return layer;
  };
}
