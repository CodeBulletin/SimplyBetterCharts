import type { ScaleManager } from "../../Scales/ScaleManager";
import type { Domain, ScaleId } from "../../Types/types";

export interface ScaledLayer {
  computeDomain?(): Domain | undefined;
  setScales(scales: ScaleManager): void;
  getScaleIds?(): ScaleId[];
}
