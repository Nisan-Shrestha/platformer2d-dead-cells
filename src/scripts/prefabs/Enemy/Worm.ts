import SpriteRenderer from "../../components/SpriteRenderer";
import Enemy from "../../entities/Enemy";
import LevelManager from "../../main/LevelManager";
import { ctx } from "../../main/main";
import { AnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { AABBIntersect, Rect2D, Vect2D } from "../../utils/utils";

export default class Worm extends Enemy {
  static WIDTH: number = 69 * 1;
  static HEIGHT: number = 45 * 1;
  static COLLIDER_WIDTH: number = 63 * 1;
  static COLLIDER_HEIGHT: number = 42 * 1;
  static SRC_X: number = 0;
  static SRC_Y: number = 0;
  static SRC_WIDTH: number = 69 * 1;
  static SRC_HEIGHT: number = 45 * 1;
  static RENDER_OFFSET_X: number = -0;
  static RENDER_OFFSET_Y: number = -3;
  static defaultSprite: HTMLImageElement = SpriteImages.wormIdle;
  ScoreAmt: number = 15;
  damageFrames: Vect2D = new Vect2D(1, 2);
  damage: number = 10;
  ATTACK_LOAD_TIME: number = 1200;
  constructor(position: Vect2D) {
    super(
      "Worm",
      position,
      100,
      0.01,
      200,
      5,
      new Vect2D(Worm.COLLIDER_WIDTH, Worm.COLLIDER_HEIGHT),
      new Vect2D(Worm.SRC_WIDTH, Worm.SRC_HEIGHT),
      new Vect2D(Worm.RENDER_OFFSET_X, Worm.RENDER_OFFSET_Y),
      true,
      SpriteImages.wormIdle,
      SpriteImages.wormWalk,
      SpriteImages.wormAtk,
      AnimInfo.wormIdle,
      AnimInfo.wormWalk,
      AnimInfo.wormAtk
    );
  }

  update(delta: number): void {
    if (this.Dead) {
      this.alpha -= delta / 1000;
      return;
    }
    this.commonStateUpdate(delta);
    if (this.inAttackRange && !this.isAttacking) {
      // console.log(this.attackTimer, this.ATTACK_LOAD_TIME);
      if (this.attackTimer <= this.ATTACK_LOAD_TIME * LevelManager.LoadTimeModFactor)
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
      this.checkAttack();
      if (this.spriteRenderer.isAnimComplete()) this.isAttacking = false;
    }
    // this.rigidBody.update(delta);
    // console.log("Worm update");
    this.handleAnimationState();
    this.spriteRenderer.update(delta);
  }

  debugDrawHitbox() {
    if (
      this.isAttacking &&
      this.spriteRenderer.frameIndex >= this.damageFrames.x &&
      this.spriteRenderer.frameIndex <= this.damageFrames.y
    ) {
      // console.log("drawing");
      SpriteRenderer.drawOffsetRect(
        ctx,
        this.position.x + (this.flipped ? -5 : this.collider.width / 2),
        this.position.y,
        this.collider.width / 2 + 5,
        this.collider.height,
        "green",
        0.3
      );
    }
  }

  checkAttack() {
    if (
      this.spriteRenderer.frameIndex >= this.damageFrames.x &&
      this.spriteRenderer.frameIndex <= this.damageFrames.y
    ) {
      let r = new Rect2D(
        this.position.x + (this.flipped ? -5 : this.collider.width / 2),
        this.position.y,
        this.collider.width / 2 + 5,
        this.collider.height
      );
      let a = AABBIntersect(
        r,
        new Rect2D(
          LevelManager.player!.position.x,
          LevelManager.player!.position.y,
          LevelManager.player!.collider.width,
          LevelManager.player!.collider.height
        )
      );
      if (a) {
        LevelManager.player!.getHurt(this.damage * LevelManager.DamageModFactor);
      }
    }
    // console.log("Worm attack");
  }
  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, Worm.WIDTH * scale, Worm.HEIGHT * scale);
    ctx.drawImage(
      Image,
      Worm.SRC_X,
      Worm.SRC_Y,
      Worm.SRC_WIDTH,
      Worm.SRC_HEIGHT,
      x,
      y,
      Worm.WIDTH * scale,
      Worm.HEIGHT * scale
    );
  }
}
