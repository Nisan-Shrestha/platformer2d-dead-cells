import Player from "../../entities/Player";
import { AnimInfo, IAnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";
import Ranged from "./Ranged";

export default class Bow extends Ranged {
  static icon: HTMLImageElement = SpriteImages.BowIcon;
  static animInfo: IAnimInfo = AnimInfo.playerAtkBowA;
  static weaponSheet: HTMLImageElement = SpriteImages.playerAtkBowA;
  // static hitBoxRect = new Rect2D(0, 0, 25, 25);
  static damageFrames = new Vect2D(5, 10);
  static ICON_HEIGHT: number = 18;
  static ICON_WIDTH: number = 18;
  static MAP_WIDTH: number = 24;
  static MAP_HEIGHT: number = 24;
  projectileArrIndex: number = 0;
  constructor(parent: Player, projectileArrIndex: number) {
    super(
      "normalArrow",
      Bow.animInfo,
      Bow.weaponSheet,
      new Vect2D(Player.COLLIDER_WIDTH, 5),
      projectileArrIndex,
      parent
    );
    this.projectileArrIndex = projectileArrIndex;
    // console.log(parent.collider)
    // const parentWidth = Player.WIDTH;
    // Bow.hitBoxRect = new Rect2D(Player.WIDTH, Player.HEIGHT, 25, 25);
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, Bow.MAP_WIDTH * scale, Bow.MAP_HEIGHT * scale);
    ctx.drawImage(
      Image,
      0,
      0,
      Bow.ICON_WIDTH,
      Bow.ICON_HEIGHT,
      x,
      y,
      Bow.MAP_WIDTH * scale,
      Bow.MAP_HEIGHT * scale
    );
  }
}
