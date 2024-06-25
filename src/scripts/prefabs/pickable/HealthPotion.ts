import Pickable from "../../entities/Pickable";
import LevelManager from "../../main/LevelManager";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";

export default class HealthPotion extends Pickable {
  static WIDTH = 24;
  static HEIGHT = 24;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 24;
  static SRC_HEIGHT = 24;
  static healAmount: number = 60;
  static defaultSprite: HTMLImageElement = SpriteImages.healthPotion;

  constructor(position: Vect2D) {
    super(
      "Health Potion",
      `Heals you for ${HealthPotion.healAmount} health`,
      position,
      new Vect2D(32 * 3, 32 * 3),
      SpriteImages.healthPotion,
      new Vect2D(24, 24)
    );
  }

  onPickUp() {
    LevelManager.player!.heal(HealthPotion.healAmount);
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
    ctx.fillRect(x, y, HealthPotion.WIDTH * scale, HealthPotion.HEIGHT * scale);
    ctx.drawImage(
      Image,
      HealthPotion.SRC_X,
      HealthPotion.SRC_Y,
      HealthPotion.SRC_WIDTH,
      HealthPotion.SRC_HEIGHT,
      x,
      y,
      HealthPotion.WIDTH * scale,
      HealthPotion.HEIGHT * scale
    );
  }

  // Add any additional methods or properties as needed
}
