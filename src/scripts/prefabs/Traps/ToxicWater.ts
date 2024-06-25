import Trap from "../../entities/Traps";
import LevelManager from "../../main/LevelManager";
import { AnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class ToxicWater extends Trap {
  static WIDTH = 32 * 1;
  static HEIGHT = 32 * 1;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 32;
  static SRC_HEIGHT = 32;
  static defaultSprite: HTMLImageElement = SpriteImages.toxicWater;

  constructor(position: Vect2D) {
    super(
      "ToxicWater",
      position,
      new Vect2D(32, 32),
      SpriteImages.toxicWater,
      new Vect2D(32, 32)
    );
    this.spriteRenderer.animated = true;
    this.spriteRenderer.setAnimation(
      SpriteImages.toxicWater,
      AnimInfo.toxicWater,
      false
    );
  }
  OnHit() {
    LevelManager.player!.setPoisioned();
  }

  update(delta: number): void {
    this.spriteRenderer.update(delta);
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, ToxicWater.WIDTH * scale, ToxicWater.HEIGHT * scale);
    ctx.drawImage(
      Image,
      ToxicWater.SRC_X,
      ToxicWater.SRC_Y,
      ToxicWater.SRC_WIDTH,
      ToxicWater.SRC_HEIGHT,
      x,
      y,
      ToxicWater.WIDTH * scale,
      ToxicWater.HEIGHT * scale
    );
  }
}
