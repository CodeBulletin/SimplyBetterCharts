import type { ScaleId } from "../Types/types";
import type { Scale } from "./Scale";

export class ScaleRegistry {
  private scales = new Map<ScaleId, Scale>();

  set(id: ScaleId, scale: Scale) {
    this.scales.set(id, scale);
  }

  get<T extends Scale>(id: ScaleId): T {
    const scale = this.scales.get(id);
    if (!scale) {
      throw new Error(`Scale "${id}" not registered`);
    }
    return scale as T;
  }

  has(id: ScaleId) {
    return this.scales.has(id);
  }
}
