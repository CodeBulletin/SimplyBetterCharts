import type { Scale, Tick } from "./type";

export class LinearScale implements Scale<[number, number], number> {
  private d0 = 0;
  private d1 = 1;
  private r0 = 0;
  private r1 = 1;
  private clampEnabled = false;
  private hasDomain = false;

  setDomain(domain: [number, number]) {
    const min = domain[0];
    let max = domain[1];

    // numerical safety
    if (min === max) {
      max = min + 1e-6;
    }

    this.d0 = min;
    this.d1 = max;

    this.hasDomain = true;
  }

  setRange(min: number, max: number) {
    this.r0 = min;
    this.r1 = max;
  }

  clamp(enable: boolean) {
    this.clampEnabled = enable;
  }

  map(value: number): number {
    let t = (value - this.d0) / (this.d1 - this.d0);

    if (this.clampEnabled) {
      t = Math.max(0, Math.min(1, t));
    }

    return this.r0 + t * (this.r1 - this.r0);
  }

  invert(px: number): number {
    const t = (px - this.r0) / (this.r1 - this.r0);
    return this.d0 + t * (this.d1 - this.d0);
  }

  ticks(count = 5) {
    if (!this.hasDomain) return [];
    const ticks: Tick<number>[] = [];
    const step = (this.d1 - this.d0) / (count - 1);

    for (let i = 0; i < count; i++) {
      const value = this.d0 + step * i;
      ticks.push({
        value,
        position: this.map(value),
        label: Number.isInteger(value) ? String(value) : value.toFixed(2),
      });
    }

    return ticks;
  }

  get domain(): [number, number] {
    return [this.d0, this.d1];
  }
}
