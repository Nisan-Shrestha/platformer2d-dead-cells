import RectCollider from "../../components/RectCollider";
import SpriteRenderer from "../../components/SpriteRenderer";
import Melee from "../../components/WeaponBase/Melee";
import Player from "../../entities/Player";
import { AnimInfo, IAnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { AABBIntersect, Rect2D, Vect2D } from "../../utils/utils";

export default class BroadSword extends Melee {
  static icon: HTMLImageElement = SpriteImages.boradSwordIcon;
  static animInfo: IAnimInfo = AnimInfo.playerAtkBroadSword;
  static weaponSheet: HTMLImageElement = SpriteImages.playerAtkBroadSword;
  // static hitBoxRect = new Rect2D(0, 0, 25, 25);
  static damageFrames = new Vect2D(14, 21);
  static ICON_HEIGHT: number = 18;
  static ICON_WIDTH: number = 18;
  static MAP_WIDTH: number = 24;
  static MAP_HEIGHT: number = 24;
  constructor(parent: Player) {
    super(
      "sword",
      45,
      BroadSword.icon,
      BroadSword.animInfo,
      BroadSword.weaponSheet,
      new Rect2D(33 - 8, Player.RENDER_OFFSET_Y + 8, 65 + 8, 100 - 8),
      BroadSword.damageFrames,
      parent
    );
  }

  checkAttack() {
    this.parent.spriteRenderer.setRenderOffset(
      new Vect2D(this.parent.flipped ? 44 : -44, Player.RENDER_OFFSET_Y)
    );
    // console.log(this.parent.spriteRenderer.animationProgress);
    if (this.parent.spriteRenderer.frameIndex > this.damageFrames.x)
      this.parent.spriteRenderer.setRenderOffset(
        new Vect2D(Player.RENDER_OFFSET_X, Player.RENDER_OFFSET_Y)
      );
    if (
      this.parent.spriteRenderer.frameIndex >= this.damageFrames.x &&
      this.parent.spriteRenderer.frameIndex < this.damageFrames.y
    ) {
      let r = new Rect2D(
        this.parent.flipped
          ? this.parent.position.x +
            this.parent.collider.width -
            this.hitBoxRect.x -
            this.hitBoxRect.width
          : this.parent.position.x + this.hitBoxRect.x, // Handle flipping
        this.parent.position.y + this.hitBoxRect.y,
        this.hitBoxRect.width + 5,
        this.hitBoxRect.width
      );
      RectCollider.EnemyColliderArray.forEach((enemyCollider) => {
        let a = AABBIntersect(
          r,
          new Rect2D(
            enemyCollider.parentObj.position.x,
            enemyCollider.parentObj.position.y,
            enemyCollider.width,
            enemyCollider.height
          )
        );

        if (a) {
          console.log("enemy hurt");
          enemyCollider.parentObj.getHurt(this.damage);
        }
      });
    }
  }
  debugDraw(
    ctx: CanvasRenderingContext2D,
    color: string = "green",
    scale: number = 1
  ) {
    if (
      this.parent.isAttackingMelee &&
      this.parent.spriteRenderer.frameIndex >= this.damageFrames.x &&
      this.parent.spriteRenderer.frameIndex < this.damageFrames.y
    ) {
      ctx.fillStyle = color;
      ctx.save();
      let flipped = this.parent.flipped;

      SpriteRenderer.drawOffsetRect(
        ctx,
        flipped
          ? this.parent.position.x +
              this.parent.collider.width -
              this.hitBoxRect.x -
              this.hitBoxRect.width
          : this.parent.position.x + this.hitBoxRect.x,
        this.parent.position.y + this.hitBoxRect.y,
        this.hitBoxRect.width * scale,
        this.hitBoxRect.height * scale,
        color,
        0.5
      );
      ctx.restore();
    }
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
      BroadSword.MAP_WIDTH * scale,
      BroadSword.MAP_HEIGHT * scale
    );
    ctx.drawImage(
      Image,
      0,
      0,
      BroadSword.ICON_WIDTH,
      BroadSword.ICON_HEIGHT,
      x,
      y,
      BroadSword.MAP_WIDTH * scale,
      BroadSword.MAP_HEIGHT * scale
    );
  }
}
