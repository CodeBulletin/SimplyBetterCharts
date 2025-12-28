import type { Primitive } from "../../Core/Primitives/Primitives";

export interface Renderer {
  render(primitives: Primitive[]): void;
  destroy(): void;
}
