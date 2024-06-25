import Melee from "../../components/WeaponBase/Melee";
import Player from "../../entities/Player";
import { AnimInfo, IAnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { Rect2D, Vect2D } from "../../utils/utils";

export default class Sword extends Melee {
  static icon: HTMLImageElement = SpriteImages.swordIcon;
  static animInfo: IAnimInfo = AnimInfo.playerAtkSword;
  static weaponSheet: HTMLImageElement = SpriteImages.playerAtkSword;
  // static hitBoxRect = new Rect2D(0, 0, 25, 25);
  static damageFrames = new Vect2D(5, 10);
  static ICON_HEIGHT: number = 18;
  static ICON_WIDTH: number = 18;
  static MAP_WIDTH: number = 24;
  static MAP_HEIGHT: number = 24;
  constructor(parent: Player) {
    super(
      "sword",
      25,
      Sword.icon,
      Sword.animInfo,
      Sword.weaponSheet,
      new Rect2D(
        Player.COLLIDER_WIDTH / 2,
        -5,
        22 + Player.COLLIDER_WIDTH / 2,
        42 + 5
      ),
      Sword.damageFrames,
      parent
    );
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, Sword.MAP_WIDTH * scale, Sword.MAP_HEIGHT * scale);
    ctx.drawImage(
      Image,
      0,
      0,
      Sword.ICON_WIDTH,
      Sword.ICON_HEIGHT,
      x,
      y,
      Sword.MAP_WIDTH * scale,
      Sword.MAP_HEIGHT * scale
    );
  }
}
