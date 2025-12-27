import type { ScaleId } from "../Types/types";
import type { Scale } from "./Scale";

export class ScaleRegistry {
  private scales = new Map<unknown, unknown>();

  set<D, I>(id: ScaleId, scale: Scale<D, I>) {
    this.scales.set(id, scale);
  }

  get<D, I>(id: ScaleId): Scale<D, I> {
    const scale = this.scales.get(id);
    if (!scale) {
      throw new Error(`Scale "${id}" not registered`);
    }
    return scale as Scale<D, I>;
  }

  has(id: ScaleId) {
    return this.scales.has(id);
  }
}
