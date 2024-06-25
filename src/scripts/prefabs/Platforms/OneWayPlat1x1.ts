import Platform from "../../entities/Platform";
import { Vect2D } from "../../utils/utils";
import { SpriteImages } from "../../utils/ImageRepo";

export default class OneWayPlat1x1 extends Platform {
  static WIDTH = 32 * 1;
  static HEIGHT = 24 * 1;
  static SRC_X = 32 * 3;
  static SRC_Y = 0;
  static SRC_WIDTH = 32 * 1;
  static SRC_HEIGHT = 24 * 1;
  static buttonActive: boolean = false;
  static defaultSprite = SpriteImages.woodenPlatform;
  constructor(position: Vect2D) {
    super(
      position.x,
      position.y,
      OneWayPlat1x1.WIDTH,
      OneWayPlat1x1.HEIGHT,
      SpriteImages.woodenPlatform,
      true
    );

    this.spriteRenderer.setSourceFrameSize(
      new Vect2D(OneWayPlat1x1.SRC_WIDTH, OneWayPlat1x1.SRC_HEIGHT)
    );
    this.spriteRenderer.setSourceOffset(
      new Vect2D(OneWayPlat1x1.SRC_X, OneWayPlat1x1.SRC_Y)
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
    ctx.fillRect(
      x,
      y,
      OneWayPlat1x1.WIDTH * scale,
      OneWayPlat1x1.HEIGHT * scale
    );
    ctx.drawImage(
      Image,
      OneWayPlat1x1.SRC_X,
      OneWayPlat1x1.SRC_Y,
      OneWayPlat1x1.SRC_WIDTH,
      OneWayPlat1x1.SRC_HEIGHT,
      x,
      y,
      OneWayPlat1x1.WIDTH * scale,
      OneWayPlat1x1.HEIGHT * scale
    );

    // console.log("drawn plat1");
  }
}
