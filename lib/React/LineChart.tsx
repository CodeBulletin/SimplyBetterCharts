import { useLayoutEffect, useRef } from "react";
import { LineLayer } from "../Core/Layer/LineLayer";
import type { LineData } from "../Core/Types/types";
import { AxisLayer } from "../Core/Layer/AxisLayer";
import type { LineChartOptions } from "../Core/Types/lib";
import { resolveAxisRenderer } from "../Core/Defaults/resolves";
import { useChartEngine } from "./useChartEngine";
import { createLayer } from "../Core/Layer/LayerRegistry";

type Props = {
  data: LineData[];
  chartOptions?: LineChartOptions;
};

export function LineChart({ data, chartOptions }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layerRef = useRef<LineLayer | null>(null);

  const { rootRef, engineRef } = useChartEngine(
    svgRef,
    chartOptions?.width ?? 500,
    chartOptions?.height ?? 500,
  );

  useLayoutEffect(() => {
    if (!svgRef.current || !engineRef.current || !rootRef.current) return;

    const engine = engineRef.current;

    const layer = createLayer("line", chartOptions) as LineLayer;

    engine.addLayer(
      new AxisLayer("bottom", resolveAxisRenderer(chartOptions?.renderer)),
    );
    engine.addLayer(
      new AxisLayer("left", resolveAxisRenderer(chartOptions?.renderer)),
    );
    engine.addLayer(layer);

    layerRef.current = layer;

    return () => {
      layerRef.current = null;
    };
  }, []); // run once

  /* ---------- data updates ---------- */
  useLayoutEffect(() => {
    layerRef.current?.setData(data);
    rootRef.current?.reflow();
  }, [data]);

  /* ---------- pointer handling ---------- */
  function onPointerMove(e: React.MouseEvent) {
    const rect = svgRef.current!.getBoundingClientRect();
    rootRef.current?.onPointerMove(e.clientX - rect.left, e.clientY - rect.top);
  }

  return (
    <svg
      ref={svgRef}
      width={chartOptions?.width ?? 500}
      height={chartOptions?.height ?? 500}
      onPointerMove={onPointerMove}
      onPointerLeave={() => rootRef.current?.clearHover()}
      onPointerCancel={() => rootRef.current?.clearHover()}
      onPointerUp={() => rootRef.current?.clearHover()}
    />
  );
}
