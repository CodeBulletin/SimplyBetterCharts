import { useLayoutEffect, useRef } from "react";
import { BarLayer } from "../Core/Layer/BarLayer";
import type { BarData } from "../Core/Types/types";
import { AxisLayer } from "../Core/Layer/AxisLayer";
import type { BarChartOptions } from "../Core/Types/lib";
import { resolveAxisRenderer } from "../Core/Defaults/resolves";
import { createLayer } from "../Core/Layer/LayerRegistry";
import { useChartEngine } from "./useChartEngine";

type Props = {
  data: BarData[];
  chartOptions?: BarChartOptions;
};

export function BarChart({ data, chartOptions }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layerRef = useRef<BarLayer | null>(null);

  const { rootRef, engineRef } = useChartEngine(
    svgRef,
    chartOptions?.width ?? 500,
    chartOptions?.height ?? 500,
  );

  useLayoutEffect(() => {
    if (!svgRef.current || !engineRef.current || !rootRef.current) return;

    const engine = engineRef.current;

    const layer = createLayer("bar", chartOptions) as BarLayer;

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

  // data updates
  useLayoutEffect(() => {
    layerRef.current?.setData(data);
    rootRef.current?.reflow();
  }, [data]);

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
