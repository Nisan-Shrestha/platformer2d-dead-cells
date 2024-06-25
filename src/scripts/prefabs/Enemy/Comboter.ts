import SpriteRenderer from "../../components/SpriteRenderer";
import Enemy from "../../entities/Enemy";
import LevelManager from "../../main/LevelManager";
import { ctx } from "../../main/main";
import { AnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { AABBIntersect, Rect2D, Vect2D } from "../../utils/utils";

export default class Comboter extends Enemy {
  static WIDTH: number = 88 / 1.5;
  static HEIGHT: number = 96 / 1.5;
  static COLLIDER_WIDTH: number = 88 / 1.5;
  static COLLIDER_HEIGHT: number = 96 / 1.5;
  static SRC_X: number = 0;
  static SRC_Y: number = 0;
  static SRC_WIDTH: number = 148;
  static SRC_HEIGHT: number = 161;
  static RENDER_OFFSET_X: number = -0;
  static RENDER_OFFSET_Y: number = -65 / 1.5;
  static defaultSprite: HTMLImageElement = SpriteImages.comboterIdle;
  ScoreAmt: number = 30;
  damageFrames: Vect2D = new Vect2D(16, 24);
  damage: number = 10;
  ATTACK_LOAD_TIME: number = 1200;
  constructor(position: Vect2D) {
    super(
      "comboter",
      position,
      100,
      0.01,
      300,
      200,
      new Vect2D(Comboter.COLLIDER_WIDTH, Comboter.COLLIDER_HEIGHT),
      new Vect2D(Comboter.SRC_WIDTH, Comboter.SRC_HEIGHT),
      new Vect2D(Comboter.RENDER_OFFSET_X, Comboter.RENDER_OFFSET_Y),
      true,
      SpriteImages.comboterIdle,
      SpriteImages.comboterWalk,
      SpriteImages.comboterAtk,
      AnimInfo.comboterIdle,
      AnimInfo.comboterWalk,
      AnimInfo.comboterAtk
    );
    this.spriteRenderer.setTargetSize(
      new Vect2D(Comboter.SRC_WIDTH/1.5, Comboter.SRC_HEIGHT/1.5)
    );
  }

  update(delta: number): void {
    if (this.Dead) {
      this.alpha -= delta / 1000;
      return;
    }
    this.commonStateUpdate(delta);
    if (this.inAttackRange && !this.isAttacking) {
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
      this.rigidBody.update(delta);
      if (this.spriteRenderer.isAnimComplete()) {
        setTimeout(() => {
          this.isAttacking = false;
        }, 1050);
      }
      // console.log(
      //   "aim: ",
      //   this.currentAnim,
      //   this.spriteRenderer.frameIndex,
      //   this.spriteRenderer.animationProgress
      // );
    }
    // this.rigidBody.update(delta);
    this.handleAnimationState();
    this.spriteRenderer.update(delta);
  }

  handleAnimationState() {
    if (this.isAttacking && this.currentAnim !== this.atkAnimInfo) {
      // console.log("anim to attack");
      this.currentAnim = this.atkAnimInfo;
      this.spriteRenderer.setAnimation(this.atkSheet, this.atkAnimInfo, true);
      return;
    }

    if (this.isAttacking) {
      this.spriteRenderer.setRenderOffset(
        new Vect2D(
          (60 / 1.5) * (this.flipped ? 1 : -1),
          Comboter.RENDER_OFFSET_Y
        )
      );
      return;
    }

    if (
      this.rigidBody.vx === 0 &&
      this.isGrounded &&
      // !this.isFalling &&
      // !this.isJumping &&
      !this.isAttacking &&
      this.currentAnim !== this.idleAnimInfo
    ) {
      this.spriteRenderer.setRenderOffset(
        new Vect2D(Comboter.RENDER_OFFSET_X, Comboter.RENDER_OFFSET_Y)
      );
      this.currentAnim = this.idleAnimInfo;
      // console.log("idle");
      this.spriteRenderer.setAnimation(this.idleSheet, this.idleAnimInfo);
    }
    if (
      this.rigidBody.vx !== 0 &&
      this.isGrounded &&
      this.currentAnim !== this.moveAnimInfo
    ) {
      this.spriteRenderer.setRenderOffset(
        new Vect2D(Comboter.RENDER_OFFSET_X, Comboter.RENDER_OFFSET_Y)
      );
      this.currentAnim = this.moveAnimInfo;
      // console.log("enemyRUn");
      this.spriteRenderer.setAnimation(this.moveSheet, this.moveAnimInfo);
    }
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
      if (this.flipped) this.moveLeft(200);
      else this.moveRight(200);
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
        LevelManager.player!.getHurt(this.damage - LevelManager.DamageModFactor);
      }
    }
    // console.log("comboter attack");
  }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, Comboter.WIDTH * scale, Comboter.HEIGHT * scale);
    ctx.drawImage(
      Image,
      Comboter.SRC_X - Comboter.RENDER_OFFSET_X * 1.5,
      Comboter.SRC_Y - Comboter.RENDER_OFFSET_Y * 1.5,
      Comboter.WIDTH * 1.5,
      Comboter.HEIGHT * 1.5,
      x,
      y,
      Comboter.WIDTH * scale,
      Comboter.HEIGHT * scale
    );
  }
}
