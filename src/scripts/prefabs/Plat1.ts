import Platform from "../entities/Platform";
import { Vect2D } from "../utils/utils";
import Constants from "../utils/constants";
import { constants } from "buffer";

class Plat1 extends Platform {
  static WIDTH = 32 * 2;
  static HEIGHT = 32 * 1;
  static SRC_X = 32 * 9;
  static SRC_Y = 0;
  static SRC_WIDTH = 32 * 2 - 4;
  static SRC_HEIGHT = 32 * 1;
  static buttonActive: boolean = false;
  constructor(position: Vect2D, platformImage: HTMLImageElement) {
    super(position.x, position.y, Plat1.WIDTH, Plat1.HEIGHT, platformImage);
    
    this.spriteRenderer.setSourceFrameSize(
      new Vect2D(Plat1.SRC_WIDTH, Plat1.SRC_HEIGHT)
    );
    this.spriteRenderer.setSourceOffset(
      new Vect2D(Plat1.SRC_X, Plat1.SRC_Y)
    );
  }
  render(ctx: CanvasRenderingContext2D) {
    this.spriteRenderer.render(ctx);
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, Plat1.WIDTH * scale, Plat1.HEIGHT * scale);
    ctx.drawImage(
      Image,
      Plat1.SRC_X,
      Plat1.SRC_Y,
      Plat1.SRC_WIDTH,
      Plat1.SRC_HEIGHT,
      x,
      y,
      Plat1.WIDTH * scale,
      Plat1.HEIGHT * scale
    );

    // console.log("drawn plat1");
  }
}

export default Plat1;
