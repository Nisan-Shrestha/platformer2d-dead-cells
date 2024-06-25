import HealthBar from "../components/HealthBar";
import RectCollider from "../components/RectCollider";
import RigidBody from "../components/RigidBody";
import SpriteRenderer from "../components/SpriteRenderer";
import LevelManager from "../main/LevelManager";
import { ctx } from "../main/main";
import { IAnimInfo } from "../utils/AnimationInfo";
import { AABBIntersect, ColliderLayer, Rect2D, Vect2D } from "../utils/utils";

export default class Enemy {
  name: string = "Enemy";
  moveSpeed: number = 0;
  vision: number = 200;
  range: number = 5;
  position: Vect2D;
  rigidBody: RigidBody;
  collider: RectCollider;
  groundCheckCollider: RectCollider;
  LeftGroundCheckRect: Rect2D;
  RightGroundCheckRect: Rect2D;
  spriteRenderer: SpriteRenderer;
  healthBar: HealthBar;
  // Anim sheets
  idleSheet: HTMLImageElement;
  moveSheet: HTMLImageElement;
  atkSheet: HTMLImageElement;
  // Anim info
  idleAnimInfo: IAnimInfo;
  moveAnimInfo: IAnimInfo;
  atkAnimInfo: IAnimInfo;

  // States
  currentAnim: IAnimInfo;

  moved: boolean = false;
  isGrounded: boolean = false;
  canGoLeft: boolean = false;
  canGoRight: boolean = false;
  isAttacking: boolean = false;
  flipped: boolean = false;
  inAttackRange: boolean = false;
  invincible: boolean = false;
  Dead: boolean = false;
  alpha: number = 1;
  attackTimer: number = 0;
  readonly ATTACK_LOAD_TIME: number = 1400;
  readonly INVINCIBLE_TIMER: number = 700;

  ScoreAmt: number = 10;
  constructor(
    name: string = "Enemy",
    position: Vect2D,
    health: number = 100,
    moveSpeed: number = 0,
    vision: number = 200,
    range: number = 5,
    colliderSize: Vect2D,
    spriteSize: Vect2D,
    spriteRenderOffset: Vect2D,
    spriteAnimated: boolean = true,
    idleSheet: HTMLImageElement,
    moveSheet: HTMLImageElement,
    atkSheet: HTMLImageElement,
    idleAnimInfo: IAnimInfo,
    moveAnimInfo: IAnimInfo,
    atkAnimInfo: IAnimInfo
  ) {
    this.name = name;
    this.position = position;
    this.vision = vision;
    this.range = range;
    this.healthBar = new HealthBar(this, health);
    this.moveSpeed = moveSpeed;
    this.rigidBody = new RigidBody(this, 0.2);
    //assign anim sheets
    this.idleSheet = idleSheet;
    this.moveSheet = moveSheet;
    this.atkSheet = atkSheet;
    // assign Anim info
    this.idleAnimInfo = idleAnimInfo;
    this.moveAnimInfo = moveAnimInfo;
    this.atkAnimInfo = atkAnimInfo;
    // set current anim
    this.currentAnim = idleAnimInfo;
    this.spriteRenderer = new SpriteRenderer(
      this,
      spriteSize.x,
      spriteSize.y,
      idleSheet,
      spriteAnimated,
      idleAnimInfo
    );
    this.spriteRenderer.setRenderOffset(spriteRenderOffset);
    this.collider = new RectCollider(
      this,
      colliderSize.x,
      colliderSize.y,
      ColliderLayer.Enemy,
      false,
      0,
      0
    );
    this.groundCheckCollider = new RectCollider(
      this,
      colliderSize.x * 0.9,
      10,
      ColliderLayer.Utility,
      true,
      colliderSize.x * 0.05,
      colliderSize.y - 5
    );
    this.LeftGroundCheckRect = new Rect2D(-5, colliderSize.y - 5, 5, 10);
    this.RightGroundCheckRect = new Rect2D(
      colliderSize.x,
      colliderSize.y - 5,
      5,
      10
    );
    LevelManager.activeEnemyArr.push(this);
  }
  moveLeft(multiplier: number = 1) {
    if (!this.isAttacking) this.flipped = true;
    if (!this.canGoLeft) return;
    if (this.rigidBody.vx > 0) this.rigidBody.vx = 0;
    this.rigidBody.ax =
      (-this.moveSpeed * multiplier * 3) / (this.isAttacking ? 1000 : 100);
    this.moved = true;
  }
  moveRight(multiplier: number = 1) {
    if (!this.isAttacking) this.flipped = false;
    if (!this.canGoRight) return;
    if (this.rigidBody.vx < 0) this.rigidBody.vx = 0;
    this.rigidBody.ax =
      (this.moveSpeed * multiplier * 3) / (this.isAttacking ? 1000 : 100);
    this.moved = true;
  }
  debugDrawHitbox() {}

  moveToPlayer() {
    if (
      this.Dead ||
      LevelManager.player!.position.y + LevelManager.player!.collider.height <
        this.position.y ||
      LevelManager.player!.position.y > this.position.y + this.collider.height
    )
      return; // Because enemny not in same level as player.
    let dx = Math.abs(
      this.position.x +
        this.collider.width / 2 -
        LevelManager.player!.position.x -
        LevelManager.player!.collider.width / 2
    );
    if (dx > this.vision) return; // Because player is out of vision
    // check Dirn of player
    if (
      LevelManager.player!.position.x + LevelManager.player!.collider.width <
      this.position.x + (this.flipped ? 0 : this.collider.width / 2)
    ) {
      // console.log("attempt Move left");
      this.moveLeft();
    } else if (
      LevelManager.player!.position.x >
      this.position.x + this.collider.width / (this.flipped ? 2 : 1)
    ) {
      // console.log("attempt Move right");
      this.moveRight();
    } else this.rigidBody.ax = 0;

    if (
      dx <=
        this.range +
          this.collider.width / 2 +
          LevelManager.player!.collider.width / 2 &&
      !this.isAttacking
    ) {
      // console.log("SOOMASDOAKNS");
      this.inAttackRange = true;
    }
  }

  commonStateUpdate(delta: number) {
    if (this.Dead) return;
    this.moved = false;
    this.moveToPlayer();
    if (!this.moved) {
      this.rigidBody.ax = 0;
    }
    this.rigidBody.update(delta, this.isGrounded);
    this.isGrounded = false;
    this.canGoRight = false;
    this.canGoLeft = false;
    // document.rectarray = RectCollider.colliderArray;

    // Collision cehck against each tile
    RectCollider.groundColliderArray.forEach((collider) => {
      // if (collider.parentObj instanceof Player) return;
      let groundColliderRect = new Rect2D(
        collider.parentObj.position.x,
        collider.parentObj.position.y,
        collider.width,
        collider.height
      );
      let enemyCollider = new Rect2D(
        this.position.x,
        this.position.y,
        this.collider.width,
        this.collider.height
      );
      let groundCheckCollider = new Rect2D(
        this.position.x + this.groundCheckCollider.offsetX,
        this.position.y + this.groundCheckCollider.offsetY,
        this.groundCheckCollider.width,
        this.groundCheckCollider.height
      );
      let LgroundCheckCollider = new Rect2D(
        this.position.x + this.LeftGroundCheckRect.x,
        this.position.y + this.LeftGroundCheckRect.y,
        this.LeftGroundCheckRect.width,
        this.LeftGroundCheckRect.height
      );
      let RgroundCheckCollider = new Rect2D(
        this.position.x + this.RightGroundCheckRect.x,
        this.position.y + this.RightGroundCheckRect.y,
        this.RightGroundCheckRect.width,
        this.RightGroundCheckRect.height
      );
      // let boolCheck = AABBIntersect(groundCheckCollider, groundColliderRect);
      this.isGrounded = AABBIntersect(groundCheckCollider, groundColliderRect)
        ? true
        : this.isGrounded;
      this.canGoLeft = AABBIntersect(LgroundCheckCollider, groundColliderRect)
        ? true
        : this.canGoLeft;
      this.canGoRight = AABBIntersect(RgroundCheckCollider, groundColliderRect)
        ? true
        : this.canGoRight;

      if (AABBIntersect(enemyCollider, groundColliderRect)) {
        collider.debugDraw(ctx);
        let dir = RectCollider.getAABBDirection(this.collider, collider);
        // console.log(dir);

        if (dir === "up") {
          RectCollider.ResolveUp(this.collider, collider);
          this.rigidBody.vy = 0;
        } else if (collider.parentObj.oneWay) {
          // do nothing and exit out of if branching;
        } else if (dir === "left") {
          RectCollider.ResolveLeft(this.collider, collider);
          this.rigidBody.vx = 0;
        } else if (dir === "right") {
          RectCollider.ResolveRight(this.collider, collider);
          this.rigidBody.vx = 0;
        } else if (dir === "down") {
          RectCollider.ResolveDown(this.collider, collider);
          this.rigidBody.vy = 0;
          // this.isGrounded = true;
        }
      }
      // console.log( collider.parentObj.name);
    });
    if (!this.isAttacking) {
      if (!this.flipped && this.rigidBody.vx < 0) this.flipped = true;
      if (this.flipped && this.rigidBody.vx > 0) this.flipped = false;
    }
    // console.log(this.rigidBody.vx, this.rigidBody.ax);
  }

  getHurt(amount: number) {
    // console.log("hit");
    if (this.invincible) return;
    this.healthBar.value -= amount;
    this.invincible = true;
    this.attackTimer = 0;
    setTimeout(() => {
      this.invincible = false;
    }, this.INVINCIBLE_TIMER);
    if (this.healthBar.value <= 0) {
      this.die();
    }
  }
  die() {
    if (this.Dead) {
      return;
    }
    LevelManager.Score += this.ScoreAmt;
    this.Dead = true;
    // Remove collider reference from ColliderStatic array
    const index = RectCollider.EnemyColliderArray.indexOf(this.collider);
    if (index !== -1) {
      RectCollider.EnemyColliderArray.splice(index, 1);
    }
    setTimeout(() => {
      const enemyIndex = LevelManager.activeEnemyArr.indexOf(this);
      console.log(
        "enemyIndex",
        enemyIndex,
        this.name,
        LevelManager.activeEnemyArr
      );
      if (enemyIndex !== -1) {
        LevelManager.activeEnemyArr.splice(enemyIndex, 1);
      }
      console.log("enemyIndex", this.name, LevelManager.activeEnemyArr);
    }, 1000);
    // Remove object reference from LevelManager's activeEnemyArr
  }

  update(delta: number) {
    
    console.log("This enemy class needs an update method, but the delta was: ", delta);
  }

  render(ctx: CanvasRenderingContext2D) {
    // this.collider.debugDraw(ctx, "red");
    SpriteRenderer.drawOffsetRect(
      ctx,
      this.position.x + this.LeftGroundCheckRect.x,
      this.position.y + this.LeftGroundCheckRect.y,
      this.LeftGroundCheckRect.width,
      this.LeftGroundCheckRect.height,
      "green",
      0.5
    );
    SpriteRenderer.drawOffsetRect(
      ctx,
      this.position.x + this.RightGroundCheckRect.x,
      this.position.y + this.RightGroundCheckRect.y,
      this.RightGroundCheckRect.width,
      this.RightGroundCheckRect.height,
      "green",
      0.5
    );
    this.groundCheckCollider.debugDraw(ctx, "blue");
    this.spriteRenderer.render(ctx, this.alpha);
    this.healthBar.render(ctx);
    this.debugDrawHitbox();
    let r = new Rect2D(
      this.position.x,
      this.position.y,
      this.collider.width,
      this.collider.height
    );
    SpriteRenderer.drawOffsetRect(ctx, r.x, r.y, r.width, r.height, "red", 0.5);
    ctx.fillStyle = "blue";
  }

  handleAnimationState() {
    if (this.isAttacking && this.currentAnim !== this.atkAnimInfo) {
      this.currentAnim = this.atkAnimInfo;
      this.spriteRenderer.setAnimation(this.atkSheet, this.atkAnimInfo, true);
      return;
    }

    if (this.isAttacking) {
      return;
    }

    if (
      this.rigidBody.vx === 0 &&
      this.isGrounded &&
      !this.isAttacking &&
      this.currentAnim !== this.idleAnimInfo
    ) {
      this.currentAnim = this.idleAnimInfo;
      // console.log("idle");
      this.spriteRenderer.setAnimation(this.idleSheet, this.idleAnimInfo);
    }
    if (
      this.rigidBody.vx !== 0 &&
      this.isGrounded &&
      this.currentAnim !== this.moveAnimInfo
    ) {
      this.currentAnim = this.moveAnimInfo;
      this.spriteRenderer.setAnimation(this.moveSheet, this.moveAnimInfo);
    }
  }
}
