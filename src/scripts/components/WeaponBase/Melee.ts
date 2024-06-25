import { IAnimInfo } from "../../utils/AnimationInfo";
import Weapon from "./Weapon";
import { AABBIntersect, Rect2D, Vect2D } from "../../utils/utils";
import Player from "../../entities/Player";
import SpriteRenderer from "../SpriteRenderer";
import RectCollider from "../RectCollider";

export default class Melee extends Weapon {
  icon: HTMLImageElement;
  damage: number;
  animInfo: IAnimInfo;
  weaponSheet: HTMLImageElement;
  hitBoxRect: Rect2D;
  damageFrames: Vect2D; // x-> start damage, y-> end damage
  parent: Player;
  damageMult: number = 1;
  //!debug var: draws the damage Collider rect
  debugMode: boolean = false;
  constructor(
    name: string,
    damage: number,
    icon: HTMLImageElement,
    animInfo: IAnimInfo,
    weaponSheet: HTMLImageElement,
    hitBoxRect: Rect2D,
    damageFrames: Vect2D,
    parent: Player
  ) {
    super(name);
    this.icon = icon;
    this.damage = damage;
    this.animInfo = animInfo;
    this.weaponSheet = weaponSheet;
    this.hitBoxRect = hitBoxRect;
    this.damageFrames = damageFrames;
    this.parent = parent;
  }

  checkAttack() {
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
        this.parent.collider.width + 5,
        this.parent.collider.height
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
          enemyCollider.parentObj.getHurt(this.damage * this.damageMult);
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
      // console.log(
      //   this.parent.position.x + this.hitBoxRect.x,
      //   this.parent.position.y + this.hitBoxRect.y,
      //   this.hitBoxRect.width * scale,
      //   this.hitBoxRect.height * scale
      // );
      ctx.save();
      let flipped = this.parent.flipped;
      // if (flipped) {
      //   // console.log("flipped");
      //   ctx.translate(
      //     this.parent.position.x +
      //       this.hitBoxRect.x -
      //       LevelManager.cameraOffsetX * 2,
      //     this.parent.position.y + this.hitBoxRect.y
      //   );
      //   ctx.scale(-1, 1);
      // }
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
}
