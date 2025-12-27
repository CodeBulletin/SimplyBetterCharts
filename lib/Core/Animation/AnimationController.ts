export class AnimationController {
  private t = 1;
  private running = false;

  start() {
    this.t = 0;
    this.running = true;
  }
  update(dt: number, duration: number): number {
    if (!this.running) return 1;

    if (duration <= 0) {
      this.t = 1;
      this.running = false;
      return 1;
    }

    // 🔑 ensure progress even if dt is tiny
    const delta = Math.max(dt, 1 / 60);

    this.t += delta / duration;

    if (this.t >= 1) {
      this.t = 1;
      this.running = false;
    }

    return this.t;
  }

  get active(): boolean {
    return this.running;
  }

  stop() {
    this.running = false;
    this.t = 1;
  }
}
