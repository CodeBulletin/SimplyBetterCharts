import type { Scale } from "./Scale";

export class BandScale<T = string | number> implements Scale<T[]> {
  private domain: T[] = [];
  private index = new Map<T, number>();

  private r0 = 0;
  private r1 = 1;

  private paddingInner = 0.1;
  private paddingOuter = 0.1;

  setDomain(values: T[]) {
    this.domain = values;
    this.index.clear();

    values.forEach((v, i) => {
      this.index.set(v, i);
    });
  }

  setRange(min: number, max: number) {
    this.r0 = min;
    this.r1 = max;
  }

  setPadding(inner = 0.1, outer = inner) {
    this.paddingInner = inner;
    this.paddingOuter = outer;
  }

  get step(): number {
    const n = this.domain.length;
    if (n === 0) return 0;

    const totalPadding = this.paddingOuter * 2 + this.paddingInner * (n - 1);

    return (this.r1 - this.r0) / (n + totalPadding);
  }

  get bandwidth(): number {
    return this.step * (1 - this.paddingInner);
  }

  map(value: T): number {
    const i = this.index.get(value);
    if (i === undefined) return NaN;

    return (
      this.r0 + this.step * this.paddingOuter + i * this.step + this.step / 2
    );
  }

  invert(px: number): T | null {
    const offset = px - this.r0 - this.step * this.paddingOuter;
    const i = Math.floor(offset / this.step);
    return this.domain[i] ?? null;
  }

  get domainValues(): T[] {
    return this.domain;
  }
}
