import { LinearScale } from "./LinearScale";
import { BandScale } from "./BandScale";
import { ScaleRegistry } from "./ScaleRegistry";

type cm = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export class ScaleManager extends ScaleRegistry {
  width = 0;
  height = 0;

  private xLinear = new LinearScale();
  private xBand = new BandScale<string | number>();
  private yLinear = new LinearScale();
  readonly margins: cm;

  constructor(margins: cm) {
    super();

    // 🔑 register STABLE instances
    this.set("x", this.xLinear);
    this.set("y", this.yLinear);
    this.margins = margins;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    const { left, right, top, bottom } = this.margins;

    // X scales → left → right
    this.xLinear.setRange(left, width - right);
    this.xBand.setRange(left, width - right);

    // Y scale → bottom → top (SVG coordinate system)
    this.yLinear.setRange(height - bottom, top);
  }

  /** 🔁 switch X scale type WITHOUT replacing instance */
  useBandX() {
    this.xBand.setPadding(0.2, 0.2);
    this.set("x", this.xBand);
  }

  useLinearX() {
    this.set("x", this.xLinear);
  }
}
