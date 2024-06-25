import Trap from "../../entities/Traps";
import LevelManager from "../../main/LevelManager";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class Spike extends Trap {
  static WIDTH = 32 * 1;
  static HEIGHT = 32 * 1;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 32;
  static SRC_HEIGHT = 32;
  static RENDER_OFFSET_X = 0;
  static RENDER_OFFSET_Y = 16;
  static defaultSprite: HTMLImageElement = SpriteImages.spike;

  constructor(position: Vect2D) {
    super(
      "Spike",
      position,
      new Vect2D(32, 32),
      SpriteImages.spike,
      new Vect2D(32, 16)
    );
    this.spriteRenderer.setRenderOffset(
      new Vect2D(Spike.RENDER_OFFSET_X, Spike.RENDER_OFFSET_Y)
    );
    // LevelManager.envElementArr.push(this)
  }
  OnHit() {
    if (!this.active) return;
    LevelManager.player!.getHurt(15);
    this.active = false;
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    // ctx.fillStyle = "lightgray";
    // ctx.fillRect(x, y, Spike.WIDTH * scale, Spike.HEIGHT * scale);
    ctx.drawImage(
      Image,
      Spike.SRC_X - Spike.RENDER_OFFSET_X,
      Spike.SRC_Y - Spike.RENDER_OFFSET_Y,
      Spike.WIDTH,
      Spike.HEIGHT,
      x,
      y,
      Spike.WIDTH * scale,
      Spike.HEIGHT * scale
    );
  }
}
