import Platform from "../../entities/Platform";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class Plat1x3 extends Platform {
  static WIDTH = 32 * 1;
  static HEIGHT = 32 * 3;
  static SRC_X = 0;
  static SRC_Y = 32 * 8;
  static SRC_WIDTH = 32 * 1;
  static SRC_HEIGHT = 32 * 3;
  static buttonActive: boolean = false;
  static defaultSprite: HTMLImageElement = SpriteImages.envSprite;

  constructor(position: Vect2D) {
    super(
      position.x,
      position.y,
      Plat1x3.WIDTH+1,
      Plat1x3.HEIGHT,
      SpriteImages.envSprite
    );

    this.spriteRenderer.setSourceFrameSize(
      new Vect2D(Plat1x3.SRC_WIDTH, Plat1x3.SRC_HEIGHT)
    );
    this.spriteRenderer.setSourceOffset(
      new Vect2D(Plat1x3.SRC_X, Plat1x3.SRC_Y)
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
    ctx.drawImage(
      Image,
      Plat1x3.SRC_X,
      Plat1x3.SRC_Y,
      Plat1x3.SRC_WIDTH,
      Plat1x3.SRC_HEIGHT,
      x,
      y,
      Plat1x3.WIDTH * scale,
      Plat1x3.HEIGHT * scale
    );

    // console.log("drawn plat1");
  }
}

