import { useLayoutEffect, useRef } from "react";
import { useChartEngine } from "./useChartEngine";
import type { LayerDescriptor } from "../Core/Layer/LayerDescriptor";

type Props = {
  width: number;
  height: number;
  layers: LayerDescriptor[];
};

export function CompositeChart({ width, height, layers }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { engineRef, rootRef } = useChartEngine(svgRef, width, height);

  useLayoutEffect(() => {
    if (!engineRef.current || !rootRef.current) return;

    engineRef.current.setLayers(layers);
    // rootRef.current.reflow();
  }, [layers]);

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
