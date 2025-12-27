import { useLayoutEffect, useRef } from "react";
import { ChartEngine } from "../Core/Engine/ChartEngine";
import { ChartRoot } from "../Core/ChartRoot";
import { BarLayer } from "../Core/Layer/BarLayer";
import { createAxisRenderer, createBarRenderer } from "./Factories/Factories";
import type { BarData } from "../Core/Types/types";
import {
  BarGrowPolicy,
  NoAnimationPolicy,
} from "../Core/Animation/AnimationPolicies";
import { AxisLayer } from "../Core/Layer/AxisLayer";

type Props = {
  data: BarData[];
  width: number;
  height: number;
};

export function BarChart({ data, width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef<ChartRoot | null>(null);
  const layerRef = useRef<BarLayer | null>(null);

  // 🔒 DOM-safe initialization
  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const engine = new ChartEngine(svgRef.current, width, height);
    const root = new ChartRoot(engine);

    const layer = new BarLayer(createBarRenderer("svg"), {
      initial: new BarGrowPolicy(),
      update: new NoAnimationPolicy(),
    });

    layer.setData(data);

    engine.addLayer(new AxisLayer("bottom", createAxisRenderer("svg")));
    engine.addLayer(new AxisLayer("left", createAxisRenderer("svg")));
    engine.addLayer(layer);

    root.start();

    chartRef.current = root;
    layerRef.current = layer;

    return () => {
      root.stop();
      chartRef.current = null;
      layerRef.current = null;
    };
  }, []); // run once

  // data updates
  useLayoutEffect(() => {
    layerRef.current?.setData(data);
    chartRef.current?.reflow();
  }, [data]);

  function onPointerMove(e: React.MouseEvent) {
    const rect = svgRef.current!.getBoundingClientRect();
    chartRef.current?.onPointerMove(
      e.clientX - rect.left,
      e.clientY - rect.top,
    );
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onPointerMove={onPointerMove}
      onPointerLeave={() => chartRef.current?.clearHover()}
      onPointerCancel={() => chartRef.current?.clearHover()}
      onPointerUp={() => chartRef.current?.clearHover()}
    />
  );
}
