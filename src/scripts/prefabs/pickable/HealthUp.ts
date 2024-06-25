import Pickable from "../../entities/Pickable";
import LevelManager from "../../main/LevelManager";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class HealthUp extends Pickable {
  static WIDTH = 24;
  static HEIGHT = 24;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 24;
  static SRC_HEIGHT = 24;
  static increaseAmt: number = 0.3;
  static defaultSprite: HTMLImageElement = SpriteImages.healthUp;

  constructor(position: Vect2D) {
    super(
      "Speed Up",
      `Increases Max Health by ${HealthUp.increaseAmt * 100} Points`,
      position,
      new Vect2D(32 * 3, 32 * 3),
      SpriteImages.healthUp,
      new Vect2D(24, 24)
    );
  }

  onPickUp() {
    LevelManager.player!.increaseMaxHealth(HealthUp.increaseAmt);
    this.delete();
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, HealthUp.WIDTH * scale, HealthUp.HEIGHT * scale);
    ctx.drawImage(
      Image,
      HealthUp.SRC_X,
      HealthUp.SRC_Y,
      HealthUp.SRC_WIDTH,
      HealthUp.SRC_HEIGHT,
      x,
      y,
      HealthUp.WIDTH * scale,
      HealthUp.HEIGHT * scale
    );
  }

  // Add any additional methods or properties as needed
}
