export interface AnimationContext<T = unknown> {
  readonly width: number;
  readonly height: number;
  readonly isFirstRender: boolean;
  readonly previous?: T[];
}
