import Pickable from "../../entities/Pickable";
import LevelManager from "../../main/LevelManager";
import Globals from "../../utils/constants";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";
import Sword from "../Weapons/Sword";

export default class SwordPicker extends Pickable {
  static WIDTH = 24;
  static HEIGHT = 24;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 16;
  static SRC_HEIGHT = 16;
  static defaultSprite: HTMLImageElement = SpriteImages.swordIcon;

  constructor(position: Vect2D) {
    super(
      "BroadSword",
      `Quick and Nimble! Albeit softer on the enemies.`,
      position,
      new Vect2D(32 * 3, 32 * 3),
      SpriteImages.swordIcon,
      new Vect2D(24, 24)
    );
    this.spriteRenderer.setTargetSize(new Vect2D(32, 32));
  }

  onPickUp() {
    let newPickableName = LevelManager.player!.meleeWeapon.name as keyof typeof Globals.weaponPickerMap;
    const pickerType = Globals.weaponPickerMap[newPickableName];
    new pickerType(this.position);
    LevelManager.player!.meleeWeapon = new Sword(LevelManager.player!);
    Pickable.AllPickables.splice(Pickable.AllPickables.indexOf(this), 1);
  }
  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, SwordPicker.WIDTH * scale, SwordPicker.HEIGHT * scale);
    ctx.drawImage(
      Image,
      SwordPicker.SRC_X,
      SwordPicker.SRC_Y,
      SwordPicker.SRC_WIDTH,
      SwordPicker.SRC_HEIGHT,
      x,
      y,
      SwordPicker.WIDTH * scale,
      SwordPicker.HEIGHT * scale
    );
  }

  // Add any additional methods or properties as needed
}
