export interface Scale<Domain = any> {
  setDomain(domain: Domain): void;
  setRange(min: number, max: number): void;
  map(value: any): number;
}
