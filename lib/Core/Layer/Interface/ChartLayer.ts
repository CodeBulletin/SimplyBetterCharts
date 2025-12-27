import type { Picker } from "../../Types/types";

export interface ChartLayer<T> {
  setPicker(picker: Picker<T>): void;
  getPicker(): Picker<T> | null;
}
