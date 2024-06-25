import Pickable from "../../entities/Pickable";
import LevelManager from "../../main/LevelManager";
import Globals from "../../utils/constants";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";
import BroadSword from "../Weapons/BroadSword";

export default class BroadSwordPicker extends Pickable {
  static WIDTH = 24;
  static HEIGHT = 24;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 16;
  static SRC_HEIGHT = 16;
  static defaultSprite: HTMLImageElement = SpriteImages.broadSwordIcon;

  constructor(position: Vect2D) {
    super(
      "BroadSword",
      `Slower Attacks, Higher Damage and Range. Perfect to deal with multiple enemies at once.`,
      position,
      new Vect2D(32 * 3, 32 * 3),
      SpriteImages.broadSwordIcon,
      new Vect2D(24, 24)
    );
    this.spriteRenderer.setTargetSize(new Vect2D(32, 32));
  }

  onPickUp() {
    let newPickableName = LevelManager.player!.meleeWeapon.name as keyof typeof Globals.weaponPickerMap;
    const pickerType = Globals.weaponPickerMap[newPickableName];
    new pickerType(this.position);
    LevelManager.player!.meleeWeapon = new BroadSword(LevelManager.player!);
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
    ctx.fillRect(
      x,
      y,
      BroadSwordPicker.WIDTH * scale,
      BroadSwordPicker.HEIGHT * scale
    );
    ctx.drawImage(
      Image,
      // BroadSwordPicker.defaultSprite,
      BroadSwordPicker.SRC_X,
      BroadSwordPicker.SRC_Y,
      BroadSwordPicker.SRC_WIDTH,
      BroadSwordPicker.SRC_HEIGHT,
      x,
      y,
      BroadSwordPicker.WIDTH * scale,
      BroadSwordPicker.HEIGHT * scale
    );
  }
  // Add any additional methods or properties as needed
}
