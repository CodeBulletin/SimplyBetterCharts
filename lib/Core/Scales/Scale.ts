export interface Scale<Domain, Input = unknown> {
  setDomain(domain: Domain): void;
  setRange(min: number, max: number): void;
  map(value: Input): number;
}
