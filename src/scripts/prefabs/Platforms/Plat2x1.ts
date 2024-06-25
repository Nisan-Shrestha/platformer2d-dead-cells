import Platform from "../../entities/Platform";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class Plat2x1 extends Platform {
  static WIDTH = 32 * 2;
  static HEIGHT = 32 * 1;
  static SRC_X = 32 * 9;
  static SRC_Y = 0;
  static SRC_WIDTH = 32 * 2 - 4;
  static SRC_HEIGHT = 32 * 1;
  static buttonActive: boolean = false;
  static defaultSprite: HTMLImageElement = SpriteImages.envSprite;

  constructor(position: Vect2D) {
    super(
      position.x,
      position.y,
      Plat2x1.WIDTH,
      Plat2x1.HEIGHT,
      SpriteImages.envSprite
    );

    this.spriteRenderer.setSourceFrameSize(
      new Vect2D(Plat2x1.SRC_WIDTH, Plat2x1.SRC_HEIGHT)
    );
    this.spriteRenderer.setSourceOffset(
      new Vect2D(Plat2x1.SRC_X, Plat2x1.SRC_Y)
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
    ctx.fillRect(x, y, Plat2x1.WIDTH * scale, Plat2x1.HEIGHT * scale);
    ctx.drawImage(
      Image,
      Plat2x1.SRC_X,
      Plat2x1.SRC_Y,
      Plat2x1.SRC_WIDTH,
      Plat2x1.SRC_HEIGHT,
      x,
      y,
      Plat2x1.WIDTH * scale,
      Plat2x1.HEIGHT * scale
    );

    // console.log("drawn plat1");
  }
}
