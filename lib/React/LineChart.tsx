import { useLayoutEffect, useRef } from "react";
import type { LineData } from "../Core/Types/types";
import type { LineChartOptions } from "../Core/Types/lib";
import { useChartEngine } from "./useChartEngine";

type Props = {
  data: LineData[];
  width: number;
  height: number;
  chartOptions?: LineChartOptions;
};

export function LineChart({ data, width, height, chartOptions }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { rootRef, engineRef } = useChartEngine(svgRef, width, height);

  useLayoutEffect(() => {
    if (!engineRef.current || !rootRef.current) return;

    engineRef.current.setLayers([
      {
        id: "x",
        type: "axis",
        orientation: "bottom",
        scaleId: "x:primary",
        zIndex: 0,
      },
      {
        id: "y",
        type: "axis",
        orientation: "left",
        scaleId: "y:primary",
        zIndex: 0,
      },
      {
        id: "line",
        type: "line",
        data,
        zIndex: 10,
        options: chartOptions,
      },
    ]);

    // rootRef.current.reflow();
  }, [data, chartOptions]);

  /* ---------- pointer handling ---------- */
  function onPointerMove(e: React.MouseEvent) {
    const rect = svgRef.current!.getBoundingClientRect();
    rootRef.current?.onPointerMove(e.clientX - rect.left, e.clientY - rect.top);
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onPointerMove={onPointerMove}
      onPointerLeave={() => rootRef.current?.clearHover()}
      onPointerCancel={() => rootRef.current?.clearHover()}
      onPointerUp={() => rootRef.current?.clearHover()}
    />
  );
}
