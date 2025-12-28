import { ScaleRegistry } from "./ScaleRegistry";
import type { Scale } from "./type";
import type { ScaleId } from "../Types/types";
import { LinearScale } from "./LinearScale";
import { BandScale } from "./BandScale";

type Margins = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

type ScaleKind = "linear" | "band";

export class ScaleManager extends ScaleRegistry {
  width = 0;
  height = 0;
  readonly margins: Margins;

  private scaleKinds = new Map<ScaleId, ScaleKind>();

  constructor(margins: Margins) {
    super();
    this.margins = margins;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /** 🔑 Create scale lazily */
  getOrCreate<D, I>(id: ScaleId, factory: () => Scale<D, I>): Scale<D, I> {
    if (!this.has(id)) {
      this.set(id, factory());
    }
    return this.get(id);
  }

  /** 🔑 Apply range AFTER scale exists */
  applyRange(id: ScaleId) {
    const scale = this.get(id);
    const { left, right, top, bottom } = this.margins;

    if (id.startsWith("x")) {
      scale.setRange(left, this.width - right);
    }

    if (id.startsWith("y")) {
      scale.setRange(this.height - bottom, top);
    }
  }

  /** 🔑 Factory helpers */
  createLinear(id: ScaleId) {
    const kind = this.scaleKinds.get(id);

    if (kind && kind !== "linear") {
      throw new Error(
        `Scale "${id}" was already created as ${kind}, cannot use linear`,
      );
    }

    this.scaleKinds.set(id, "linear");
    return this.getOrCreate(id, () => new LinearScale());
  }

  createBand(id: ScaleId) {
    const kind = this.scaleKinds.get(id);

    if (kind && kind !== "band") {
      throw new Error(
        `Scale "${id}" was already created as ${kind}, cannot use band`,
      );
    }

    this.scaleKinds.set(id, "band");
    return this.getOrCreate(id, () => new BandScale());
  }
}
