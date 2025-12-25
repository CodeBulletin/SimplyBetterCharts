// Core/ChartRoot.ts
import { ChartEngine } from "./Engine/ChartEngine";

export class ChartRoot {
  private rafId: number | null = null;
  private readonly engine;
  constructor(engine: ChartEngine) {
    this.engine = engine;
  }

  start() {
    if (this.rafId !== null) return;

    const loop = () => {
      this.engine.draw();
      this.rafId = requestAnimationFrame(loop);
    };

    loop();
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  onPointerMove(x: number, y: number) {
    this.engine.onPointerMove(x, y);
  }

  clearHover() {
    this.engine.clearHover();
  }
}
