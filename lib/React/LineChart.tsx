import { useLayoutEffect, useRef } from "react";
import { ChartEngine } from "../Core/Engine/ChartEngine";
import { ChartRoot } from "../Core/ChartRoot";
import { LineLayer } from "../Core/Layer/LineLayer";
import { createAxisRenderer, createLineRenderer } from "./Factories/Factories";
import type { LineData } from "../Core/Types/types";
import {
  LineBaselinePolicy,
  LineUpdatePolicy,
} from "../Core/Animation/AnimationPolicies";
import { AxisLayer } from "../Core/Layer/AxisLayer";

type Props = {
  data: LineData[];
  width: number;
  height: number;
  renderer?: "svg" | "webgl" | "webgpu" | "webgpu-3d";
};

export function LineChart({ data, width, height, renderer = "svg" }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef<ChartRoot | null>(null);
  const layerRef = useRef<LineLayer | null>(null);

  /* ---------- init (DOM-safe) ---------- */
  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const engine = new ChartEngine(svgRef.current, width, height);
    const root = new ChartRoot(engine);

    const layer = new LineLayer(createLineRenderer(renderer), {
      initial: new LineBaselinePolicy(),
      update: new LineUpdatePolicy(),
    });

    layer.setData(data);

    engine.addLayer(new AxisLayer("bottom", createAxisRenderer(renderer)));
    engine.addLayer(new AxisLayer("left", createAxisRenderer(renderer)));
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

  /* ---------- data updates ---------- */
  useLayoutEffect(() => {
    layerRef.current?.setData(data);
    chartRef.current?.reflow();
  }, [data]);

  /* ---------- pointer handling ---------- */
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
