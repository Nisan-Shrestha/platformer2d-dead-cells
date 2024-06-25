import Platform from "../../entities/Platform";
import { Vect2D } from "../../utils/utils";
import { SpriteImages } from "../../utils/ImageRepo";

export default class Plat3x3 extends Platform {
  static WIDTH = 32 * 3;
  static HEIGHT = 32 * 3;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 32 * 3;
  static SRC_HEIGHT = 32 * 3;
  static buttonActive: boolean = false;
  static defaultSprite: HTMLImageElement = SpriteImages.envSprite;

  constructor(position: Vect2D) {
    super(
      position.x,
      position.y,
      Plat3x3.WIDTH,
      Plat3x3.HEIGHT,
      SpriteImages.envSprite
    );

    this.spriteRenderer.setSourceFrameSize(
      new Vect2D(Plat3x3.SRC_WIDTH, Plat3x3.SRC_HEIGHT)
    );
    this.spriteRenderer.setSourceOffset(
      new Vect2D(Plat3x3.SRC_X, Plat3x3.SRC_Y)
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
      Plat3x3.SRC_X,
      Plat3x3.SRC_Y,
      Plat3x3.SRC_WIDTH,
      Plat3x3.SRC_HEIGHT,
      x,
      y,
      Plat3x3.WIDTH * scale,
      Plat3x3.HEIGHT * scale
    );

    // console.log("drawn plat1");
  }
}
