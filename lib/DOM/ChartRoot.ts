import type { ChartEngine } from "../Core/Engine/ChartEngine";
import { SVGRenderer } from "./Renderer/SVG/SVGRenderer";

export class ChartRoot {
  private rafId: number | null = null;
  private lastTime = 0;
  private running = false;

  private readonly engine;
  private readonly renderer;

  constructor(engine: ChartEngine, svg: SVGSVGElement) {
    this.engine = engine;
    engine.onInvalidate = () => this.invalidate();
    this.renderer = new SVGRenderer(svg); // 🔑 Renderer owns container
  }

  isStoped() {
    return this.running === false;
  }

  private loop = (time: number) => {
    if (!this.running) return;

    if (!this.lastTime) this.lastTime = time;
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    const { primitives, needsMore } = this.engine.draw(dt);
    this.renderer.render(primitives);

    if (needsMore) {
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      // idle → pause RAF
      this.rafId = null;
      this.lastTime = 0;
    }
  };

  start() {
    this.running = true;
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.renderer.destroy(); // 🔑 cleanup DOM
    this.engine.stop();

    this.lastTime = 0;
  }

  reflow() {
    this.engine.reflow();
    this.invalidate();
  }

  invalidate() {
    if (this.rafId === null) {
      this.start();
    }
  }

  onPointerMove(x: number, y: number) {
    this.engine.onPointerMove(x, y);
    this.invalidate();
  }

  clearHover() {
    this.engine.clearHover();
    this.invalidate();
  }
}
