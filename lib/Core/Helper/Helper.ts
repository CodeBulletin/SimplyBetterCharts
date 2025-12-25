export function toNumber(x: number | Date): number {
  return x instanceof Date ? x.getTime() : x;
}
