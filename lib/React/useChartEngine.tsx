import { useLayoutEffect, useRef } from "react";
import { ChartEngine } from "../Core/Engine/ChartEngine";
import { ChartRoot } from "../Core/ChartRoot";

export function useChartEngine(
  svgRef: React.RefObject<SVGSVGElement | null>,
  width: number,
  height: number,
) {
  const engineRef = useRef<ChartEngine | null>(null);
  const rootRef = useRef<ChartRoot | null>(null);

  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const engine = new ChartEngine(svgRef.current, width, height);
    const root = new ChartRoot(engine);

    engineRef.current = engine;
    rootRef.current = root;

    if (root.isStoped()) root.start();

    return () => {
      if (!root.isStoped()) root.stop();
      engineRef.current = null;
      rootRef.current = null;
    };
  }, [width, height]);

  return { engineRef, rootRef };
}
