import { LinearScale } from "./LinearScale";
import { BandScale } from "./BandScale";
import { ScaleRegistry } from "./ScaleRegistry";

export class ScaleManager extends ScaleRegistry {
  width = 0;
  height = 0;

  private xLinear = new LinearScale();
  private xBand = new BandScale<string | number>();
  private yLinear = new LinearScale();

  constructor() {
    super();

    // 🔑 register STABLE instances
    this.set("x", this.xLinear);
    this.set("y", this.yLinear);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.xLinear.setRange(0, width);
    this.xBand.setRange(0, width);
    this.yLinear.setRange(height, 0);
  }

  /** 🔁 switch X scale type WITHOUT replacing instance */
  useBandX() {
    this.set("x", this.xBand);
  }

  useLinearX() {
    this.set("x", this.xLinear);
  }
}
