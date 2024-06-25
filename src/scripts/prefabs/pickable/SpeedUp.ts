import Pickable from "../../entities/Pickable";
import LevelManager from "../../main/LevelManager";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class SpeedUp extends Pickable {
  static WIDTH = 24;
  static HEIGHT = 24;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 24;
  static SRC_HEIGHT = 24;
  static increaseAmt: number = 0.4;
  static defaultSprite: HTMLImageElement = SpriteImages.speedUp;

  constructor(position: Vect2D) {
    super(
      "Speed Up",
      `Increases Move Speed by ${SpeedUp.increaseAmt * 100}% for 10sec.`,
      position,
      new Vect2D(32 * 3, 32 * 3),
      SpriteImages.speedUp,
      new Vect2D(24, 24)
    );
  }

  onPickUp() {
    LevelManager.player!.increaseSpeedMult(SpeedUp.increaseAmt);
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
    ctx.fillRect(x, y, SpeedUp.WIDTH * scale, SpeedUp.HEIGHT * scale);
    ctx.drawImage(
      Image,
      SpeedUp.SRC_X,
      SpeedUp.SRC_Y,
      SpeedUp.SRC_WIDTH,
      SpeedUp.SRC_HEIGHT,
      x,
      y,
      SpeedUp.WIDTH * scale,
      SpeedUp.HEIGHT * scale
    );
  }

  // Add any additional methods or properties as needed
}
