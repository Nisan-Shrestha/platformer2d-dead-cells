import { IAnimInfo } from "../../utils/AnimationInfo";
import Weapon from "./Weapon";
import { Vect2D } from "../../utils/utils";
import Player from "../../entities/Player";
import Projectile from "./Projectile";
import Globals from "../../utils/constants";
import SpriteRenderer from "../SpriteRenderer";
import LevelManager from "../../main/LevelManager";

export default class Ranged extends Weapon {
  animInfo: IAnimInfo;
  weaponSheet: HTMLImageElement;
  spawnOffset: Vect2D;
  parent: Player;
  projectileArrIndex: number;
  //!debug var: draws the offset position
  debugMode: boolean = true;
  constructor(
    name: string,
    animInfo: IAnimInfo,
    weaponSheet: HTMLImageElement,
    spawnOffset: Vect2D,
    projectileArrIndex: number,
    parent: Player
  ) {
    super(name);
    this.animInfo = animInfo;
    this.weaponSheet = weaponSheet;
    this.spawnOffset = spawnOffset;
    this.projectileArrIndex = projectileArrIndex;
    this.parent = parent;
  }
  fire() {
    this.parent.isAttackingRanged = true;
    if (this.parent.flipped) {
      this.spawnOffset.x -= this.parent.collider.width;
    }
    console.log("Shot fired");
    let pos = new Vect2D(
      this.parent.position.x + this.spawnOffset.x,
      this.parent.position.y + this.spawnOffset.y
    );
    let p = new Globals.playerProjectileArr[this.projectileArrIndex](
      pos,
      new Vect2D(this.parent.flipped ? -1 : 1, 0),
      this.parent.flipped
    );
    Projectile.allProjectiles.push(p);
    if (this.parent.flipped) {
      this.spawnOffset.x += this.parent.collider.width;
    }
  }
  // attack() {
  //   if (this.debugMode) {
  //     this.debugDraw(ctx);
  //   }
  //   if (this.parent.isAttackingRanged) {
  //     //!TODO: Instantiate Projectile.
  //   }
  // }
  debugDraw(
    ctx: CanvasRenderingContext2D,
    color: string = "purple",
    scale: number = 1
  ) {
    if (this.parent.isAttackingRanged) {
      // console.log("const  = useDebugValue();");

      ctx.save();
      let flipped = this.parent.flipped;
      if (flipped) {
        // console.log("flipped");
        ctx.translate(
          this.parent.position.x +
            this.spawnOffset.x -
            LevelManager.cameraOffsetX * 2,
          this.parent.position.y + this.spawnOffset.y
        );
        ctx.scale(-1, 1);
      }
      SpriteRenderer.drawOffsetRect(
        ctx,
        flipped ? 0 : this.parent.position.x + this.spawnOffset.x,
        flipped ? 0 : this.parent.position.y + this.spawnOffset.y,
        16 * scale,
        16 * scale,
        color,
        0.5
      );
      ctx.restore();
    }
  }
}
