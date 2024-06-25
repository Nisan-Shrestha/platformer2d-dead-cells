import Platform from "../../entities/Platform";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class OneWayPlat3x1 extends Platform {
  static WIDTH = 32 * 3;
  static HEIGHT = 24 * 1;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 32 * 3;
  static SRC_HEIGHT = 24 * 1;
  static buttonActive: boolean = false;
  static defaultSprite:HTMLImageElement = SpriteImages.woodenPlatform;
  constructor(position: Vect2D) {
    super(
      position.x,
      position.y,
      OneWayPlat3x1.WIDTH,
      OneWayPlat3x1.HEIGHT,
      SpriteImages.woodenPlatform,
      true
    );

    this.spriteRenderer.setSourceFrameSize(
      new Vect2D(OneWayPlat3x1.SRC_WIDTH, OneWayPlat3x1.SRC_HEIGHT)
    );
    this.spriteRenderer.setSourceOffset(
      new Vect2D(OneWayPlat3x1.SRC_X, OneWayPlat3x1.SRC_Y)
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
      OneWayPlat3x1.SRC_X,
      OneWayPlat3x1.SRC_Y,
      OneWayPlat3x1.SRC_WIDTH,
      OneWayPlat3x1.SRC_HEIGHT,
      x,
      y,
      OneWayPlat3x1.WIDTH * scale,
      OneWayPlat3x1.HEIGHT * scale
    );

    // console.log("drawn plat1");
  }
}