import { useLayoutEffect, useRef } from "react";
import { ChartEngine } from "../Core/Engine/ChartEngine";
import { ChartRoot } from "../Core/ChartRoot";
import type { GraphFactory } from "./types";

type Props = {
  width: number;
  height: number;
  graphs: GraphFactory[];
};

export function StackedChart({ width, height, graphs }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<ChartRoot | null>(null);

  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const engine = new ChartEngine(svgRef.current);
    const root = new ChartRoot(engine);

    for (const createGraph of graphs) {
      const graph = createGraph(width, height);
      engine.addLayer(graph);
    }

    root.start();
    rootRef.current = root;

    return () => {
      root.stop();
      rootRef.current = null;
    };
  }, [graphs, width, height]);

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
