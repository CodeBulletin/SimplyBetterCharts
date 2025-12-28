// Core/Scales/TypedScales.ts
import type { Scale } from "./Scale";

export type ContinuousScale = Scale<[number, number], number>;

export type CategoricalScale<T = string | number> = Scale<T[], T> & {
  bandwidth?: number;
};

export type Tick<T = number | string> = {
  value: T;
  position: number;
  label: string;
};

export interface Scale<Domain, Input = unknown> {
  setDomain(domain: Domain): void;
  setRange(min: number, max: number): void;
  map(value: Input): number;

  ticks?(count?: number): Tick<Input>[];
}
