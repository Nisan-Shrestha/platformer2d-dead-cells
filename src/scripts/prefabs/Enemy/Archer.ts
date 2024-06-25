import Projectile from "../../components/WeaponBase/Projectile";
import Enemy from "../../entities/Enemy";
import LevelManager from "../../main/LevelManager";
import { AnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { Vect2D } from "../../utils/utils";
import DeadArrow from "../Weapons/DeadArrow";

export default class Archer extends Enemy {
  static WIDTH: number = 45 * 1;
  static HEIGHT: number = 81 - 14 * 1;
  static COLLIDER_WIDTH: number = 45 * 1;
  static COLLIDER_HEIGHT: number = (81 - 14) * 1;
  static SRC_X: number = 0;
  static SRC_Y: number = 0;
  static SRC_WIDTH: number = 72 * 1;
  static SRC_HEIGHT: number = 100 * 1;
  static RENDER_OFFSET_X: number = -1;
  static RENDER_OFFSET_Y: number = -14;
  static defaultSprite: HTMLImageElement = SpriteImages.archerIdle;
  ScoreAmt: number = 20;
  spawnOffset: Vect2D = new Vect2D(0, 12);
  timeOutID: NodeJS.Timeout | undefined = undefined;
  // damageFrames: Vect2D = new Vect2D(1, 2);

  //custom state
  shootable: boolean = true;
  damage: number = 10;
  ATTACK_LOAD_TIME: number = 1200;
  constructor(position: Vect2D) {
    super(
      "archer",
      position,
      100,
      0.01,
      500,
      250,
      new Vect2D(Archer.COLLIDER_WIDTH, Archer.COLLIDER_HEIGHT),
      new Vect2D(Archer.SRC_WIDTH, Archer.SRC_HEIGHT),
      new Vect2D(Archer.RENDER_OFFSET_X, Archer.RENDER_OFFSET_Y),
      true,
      SpriteImages.archerIdle,
      SpriteImages.archerWalk,
      SpriteImages.archerShoot,
      AnimInfo.archerIdle,
      AnimInfo.archerWalk,
      AnimInfo.archerShoot
    );
  }

  update(delta: number): void {
    if (this.Dead) {
      this.alpha -= delta / 1000;
      clearTimeout(this.timeOutID);
      return;
    }
    // console.log("archer frame: ", this.spriteRenderer.frameIndex);
    this.commonStateUpdate(delta);
    if (this.inAttackRange && !this.isAttacking) {
      // console.log(this.attackTimer, this.ATTACK_LOAD_TIME);
      if (
        this.attackTimer <=
        this.ATTACK_LOAD_TIME * LevelManager.LoadTimeModFactor
      )
        this.attackTimer += delta;
      else {
        this.attackTimer = 0;
        this.inAttackRange = false;
        this.isAttacking = true;
      }
      // this.attack();
    }
    // console.log(this.isAttacking, this.spriteRenderer.isAnimComplete());
    if (this.isAttacking) {
      if (this.spriteRenderer.animationProgress >= 0.8 && this.shootable) {
        this.shootable = false;
        // this.timeOutID = setTimeout(() => {
        this.shoot();
      }
      if (this.spriteRenderer.isAnimComplete()) {
        this.shootable = true;
        this.isAttacking = false;
      }
    }
    // this.rigidBody.update(delta);
    // console.log("archer update");
    this.handleAnimationState();
    this.spriteRenderer.update(delta);
  }

  debugDrawHitbox() {
    if (
      this.currentAnim == AnimInfo.archerShoot &&
      this.spriteRenderer.animationProgress >= 0.8 &&
      this.shootable
    ) {
      // console.log("drawing");
    }
  }

  shoot() {
    if (this.flipped) {
      this.spawnOffset.x -= this.collider.width;
    }
    // console.log("Enemy fired arrow");
    let pos = new Vect2D(
      this.position.x + this.spawnOffset.x,
      this.position.y + this.spawnOffset.y
    );
    let p = new DeadArrow(
      pos,
      new Vect2D(this.flipped ? -0.35 : 0.35, 0),
      this.flipped
    );
    Projectile.allProjectiles.push(p);
    if (this.flipped) {
      this.spawnOffset.x += this.collider.width;
    }
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.drawImage(
      Image,
      Archer.SRC_X - Archer.RENDER_OFFSET_X,
      Archer.SRC_Y - Archer.RENDER_OFFSET_Y,
      Archer.WIDTH,
      Archer.HEIGHT,
      x,
      y,
      Archer.WIDTH * scale,
      Archer.HEIGHT * scale
    );
  }
}
