import type { LayerPlugin } from "./LayerPlugin";

const plugins = new Map<string, LayerPlugin<any>>();

export function registerLayerPlugin<D extends { id: string; type: string }>(
  plugin: LayerPlugin<D>,
) {
  if (plugins.has(plugin.type)) {
    throw new Error(`Layer plugin "${plugin.type}" already registered`);
  }
  plugins.set(plugin.type, plugin);
}

export function getLayerPlugin(type: string): LayerPlugin<any> {
  const plugin = plugins.get(type);
  if (!plugin) {
    throw new Error(`Unknown layer type: "${type}"`);
  }
  return plugin;
}
