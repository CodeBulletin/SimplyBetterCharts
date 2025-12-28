import type { ScaleManager } from "../../Scales/ScaleManager";
import type { Domain } from "../../Types/types";

export interface ScaledLayer {
  computeDomain?(): Domain | undefined;
  setScales(scales: ScaleManager): void;
}
