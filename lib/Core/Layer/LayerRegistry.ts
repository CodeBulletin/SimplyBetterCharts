import type { BarChartOptions, LineChartOptions } from "../Types/lib";
import type { AnyChartLayer } from "./Interface/AnyChartLayer";

type LayerBuilder = (
  options: LineChartOptions | BarChartOptions | undefined,
) => AnyChartLayer;

const registry = new Map<string, LayerBuilder>();

export function registerLayer(type: string, builder: LayerBuilder) {
  registry.set(type, builder);
}

export function createLayer(
  type: string,
  options: LineChartOptions | BarChartOptions | undefined,
) {
  const builder = registry.get(type);
  if (!builder) {
    throw new Error(`Unknown layer type: ${type}`);
  }
  return builder(options);
}
