import { useLayoutEffect, useRef } from "react";
import type { AnyChartLayer } from "../Core/Layer/Interface/AnyChartLayer";
import type { DataLayer } from "../Core/Layer/Interface/DataLayer";
import { AxisLayer } from "../Core/Layer/AxisLayer";
import { createAxisRenderer } from "../Core/Factories/Factories";
import { createLayer } from "../Core/Layer/LayerRegistry";
import { useChartEngine } from "./useChartEngine";
import type { LayerDescriptor } from "./CompositeChartHelper";

type Props = {
  width: number;
  height: number;
  layers: LayerDescriptor[];
};

function isDataLayer<T>(
  layer: AnyChartLayer,
): layer is AnyChartLayer & DataLayer<T> {
  return "setData" in layer;
}

export function CompositeChart({ width, height, layers }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layerMapRef = useRef<Map<string, AnyChartLayer>>(new Map());

  const { engineRef, rootRef } = useChartEngine(svgRef, width, height);

  /* ---------- static layers (axes) ---------- */
  useLayoutEffect(() => {
    if (!engineRef.current) return;

    layerMapRef.current = new Map(); // 🔑 recreate instead of clear

    engineRef.current.addLayer(
      new AxisLayer("bottom", createAxisRenderer("svg")),
    );
    engineRef.current.addLayer(
      new AxisLayer("left", createAxisRenderer("svg")),
    );
  }, []);

  /* ---------- reconcile dynamic layers ---------- */
  useLayoutEffect(() => {
    if (!engineRef.current || !rootRef.current) return;

    const map = layerMapRef.current;
    const alive = new Set<string>();

    const ordered = [...layers].sort(
      (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0),
    );

    ordered.forEach((desc, index) => {
      const id = desc.id ?? `${desc.type}:${index}`;
      alive.add(id);

      let layer = map.get(id);

      if (!layer) {
        layer = createLayer(desc.type, desc.options);
        map.set(id, layer);
        engineRef.current!.addLayer(layer);
      }

      if (isDataLayer(layer)) {
        layer.setData(desc.data);
      }
    });

    // cleanup removed layers
    for (const [id, layer] of map) {
      if (!alive.has(id)) {
        layer.destroy();
        map.delete(id);
      }
    }

    rootRef.current.reflow();
    engineRef.current.markDirty();
  }, [layers]);

  return <svg ref={svgRef} width={width} height={height} />;
}
