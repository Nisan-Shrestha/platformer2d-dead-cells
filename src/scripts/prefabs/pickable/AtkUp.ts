import Pickable from "../../entities/Pickable";
import LevelManager from "../../main/LevelManager";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class AtkUp extends Pickable {
  static WIDTH = 24;
  static HEIGHT = 24;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 24;
  static SRC_HEIGHT = 24;
  static increaseAmt: number = 0.4;
  static defaultSprite: HTMLImageElement = SpriteImages.atkUp;

  constructor(position: Vect2D) {
    super(
      "Atk Up",
      `Increases Attack Damage by ${AtkUp.increaseAmt * 100}% for 10sec.`,
      position,
      new Vect2D(32 * 3, 32 * 3),
      SpriteImages.atkUp,
      new Vect2D(24, 24)
    );
  }

  onPickUp() {
    LevelManager.player!.increaseDamageMult(AtkUp.increaseAmt);
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
    ctx.fillRect(x, y, AtkUp.WIDTH * scale, AtkUp.HEIGHT * scale);
    ctx.drawImage(
      Image,
      AtkUp.SRC_X,
      AtkUp.SRC_Y,
      AtkUp.SRC_WIDTH,
      AtkUp.SRC_HEIGHT,
      x,
      y,
      AtkUp.WIDTH * scale,
      AtkUp.HEIGHT * scale
    );
  }

  // Add any additional methods or properties as needed
}
