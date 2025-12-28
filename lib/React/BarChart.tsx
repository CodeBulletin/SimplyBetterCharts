import { useLayoutEffect, useRef } from "react";
import type { BarData } from "../Core/Types/types";
import { useChartEngine } from "./useChartEngine";

type Props = {
  data: BarData[];
  width: number;
  height: number;
};

export function BarChart({ data, width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { rootRef, engineRef } = useChartEngine(svgRef, width, height);

  // data updates

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
        id: "bar",
        type: "bar",
        data, // 🔑 DATA LIVES HERE
        zIndex: 10,
        options: {
          animation: { enabled: true },
        },
      },
    ]);

    // rootRef.current.reflow();
  }, [data]); // 🔑 re-run when data changes

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
