import RectCollider from "../components/RectCollider";
import RigidBody from "../components/RigidBody";
import { SpriteRenderer } from "../components/SpriteRenderer";
import Bow from "../components/WeaponBase/Bow";
import Melee from "../components/WeaponBase/Melee";
import Ranged from "../components/WeaponBase/Ranged";
import { AnimInfo, IAnimInfo } from "../utils/AnimationInfo";
import { SpriteImages } from "../utils/ImageRepo";
import Globals from "../utils/constants";
import {
  AABBIntersect,
  ColliderLayer,
  IKeymap,
  Rect2D,
  Vect2D,
} from "../utils/utils";
// import Health from "../components/HealthBar";
import HealthBar from "../components/HealthBar";
import LevelManager from "../main/LevelManager";
// import BroadSword from "../prefabs/Weapons/BroadSword";
import Sword from "../prefabs/Weapons/Sword";
import AtkUp from "../prefabs/pickable/AtkUp";
import SpeedUp from "../prefabs/pickable/SpeedUp";
import Pickable from "./Pickable";
class Player {
  //max Sprite Width and height
  static WIDTH: number = 34;
  static HEIGHT: number = 100 - 45;
  static COLLIDER_WIDTH: number = 32 * 1;
  static COLLIDER_HEIGHT: number = 54 * 1;
  static SRC_X: number = 0;
  static SRC_Y: number = 0;
  static SRC_WIDTH: number = 158 * 1;
  static SRC_HEIGHT: number = 100 * 1;
  static RENDER_OFFSET_X: number = -0;
  static RENDER_OFFSET_Y: number = -44.5;
  static defaultSprite: HTMLImageElement = SpriteImages.playerIdle;

  INVINCIBLE_TIMER: number = 1000;
  // rect: Rect2D;
  // INFO: States
  flipped: boolean = false;
  isGrounded: boolean = false;
  isJumping: boolean = false;
  isFalling: boolean = false;
  isAttackingMelee: boolean = false;
  isAttackingRanged: boolean = false;
  inputReceived: boolean = false;
  // keysPressed = new Set<string>();
  currentAnim: IAnimInfo = AnimInfo.Idle;
  shootable: boolean = true;
  invincible: boolean = false;
  isPoisoned: boolean = false;
  disablePoisonTimeoutRef: NodeJS.Timeout | null = null;
  //Inventory
  meleeWeapon: Melee = new Sword(this);
  rangedWeapon: Ranged = new Bow(this, 0);

  //Modifiers
  speedMult: number = 1;
  healthMult: number = 1;
  damageMult: number = 1;

  // Components
  position: Vect2D;
  rigidBody: RigidBody;
  collider: RectCollider;
  groundCheckCollider: RectCollider;
  spriteRenderer: SpriteRenderer;
  healthBar = new HealthBar(this, 100);
  // Magic Numbers
  moveSpeed: number;
  keymap: Partial<IKeymap> = {
    left: ["a", "arrowleft"],
    right: ["d", "arrowright"],
    jump: ["w", " "],
    atkA: ["j", "leftM"],
    atkB: ["k", "rightM"],
    interact: ["e", "enter"],
  };

  closestPickable: Pickable | null = null;
  //CONSTRUCTOR
  constructor(pos: Vect2D) {
    this.position = new Vect2D(pos.x, pos.y);

    this.rigidBody = new RigidBody(this);
    this.rigidBody.dragX = Globals.PLAYER_DRAG_X;
    this.rigidBody.gravity = Globals.GRAVITY;
    this.collider = new RectCollider(
      this,
      Player.COLLIDER_WIDTH,
      Player.COLLIDER_HEIGHT,
      ColliderLayer.Player,
      false
    );
    this.groundCheckCollider = new RectCollider(
      this,
      this.collider.width / 1.05,
      10,
      ColliderLayer.Player,
      true,
      this.collider.width * 0.025,
      this.collider.height - 5
    );
    this.spriteRenderer = new SpriteRenderer(
      this,
      Player.SRC_WIDTH,
      Player.SRC_HEIGHT,
      SpriteImages.playerIdle,
      true,
      AnimInfo.playerIdle
    );
    this.spriteRenderer.setRenderOffset(
      new Vect2D(Player.RENDER_OFFSET_X, Player.RENDER_OFFSET_Y)
    );
    this.moveSpeed = Globals.PLAYER_MOVE_SPEED_X;
  }

  // assignKeySet(keySet: Set<string>) {
  //   this.keysPressed = keySet;
  // }

  handleInput() {
    // console.log(this.keysPressed);
    if (
      this.keymap.interact &&
      !(this.isAttackingMelee||this.isAttackingRanged) &&
      this.isKeyPressed(this.keymap.interact) &&
      this.closestPickable != null
    ) {
      this.closestPickable.onPickUp();
      Globals.keysPressed.delete(this.keymap.interact[0]);
    }
    this.inputReceived = false;
    if (
      this.keymap.atkA &&
      this.isKeyPressed(this.keymap.atkA) &&
      !this.isAttackingMelee &&
      !this.isAttackingRanged
    ) {
      this.atkMelee();
    }
    if (
      this.keymap.atkB &&
      this.isKeyPressed(this.keymap.atkB) &&
      !this.isAttackingMelee &&
      !this.isAttackingRanged
    ) {
      this.atkRanged();
    }

    if (this.keymap.left && this.isKeyPressed(this.keymap.left)) {
      this.moveLeft();
      this.inputReceived = true;
    }

    if (this.keymap.right && this.isKeyPressed(this.keymap.right)) {
      this.moveRight();
      this.inputReceived = true;
    }

    if (
      this.keymap.jump &&
      this.isKeyPressed(this.keymap.jump) &&
      this.isGrounded &&
      !this.isAttackingMelee &&
      !this.isAttackingRanged
    ) {
      this.jump();
      // this.inputReceived = true;
    }
  }

  isKeyPressed(keys: string | string[]): boolean {
    if (Array.isArray(keys)) {
      return keys.some((key) => Globals.keysPressed.has(key));
    }
    return Globals.keysPressed.has(keys);
  }

  moveLeft() {
    this.rigidBody.ax =
      ((-this.moveSpeed * this.speedMult * 3) /
        (this.isAttackingMelee && this.isGrounded ? 500 : 100)) *
      (this.isAttackingRanged ? 0 : 1);
  }
  moveRight() {
    this.rigidBody.ax =
      ((this.moveSpeed * this.speedMult * 3) /
        (this.isAttackingMelee && this.isGrounded ? 500 : 100)) *
      (this.isAttackingRanged ? 0 : 1);
  }
  jump() {
    this.rigidBody.vy = -Globals.PLAYER_JUMP_POWER;
    this.isJumping = true;
    this.isFalling = false;
  }
  atkMelee() {
    this.isAttackingMelee = true;
    // console.log(this.meleeWeapon);
    // this.meleeWeapon.attack();
    // console.log("heh");
  }
  atkRanged() {
    this.isAttackingRanged = true;
    // console.log(this.rangedWeapon);
    if (this.shootable) {
      this.shootable = false;
      setTimeout(() => {
        this.rangedWeapon.fire();
      }, AnimInfo.bow.animationLength * 0.8);
    }
    // console.log("heh");
  }

  getHurt(amount: number) {
    if (this.invincible) return;
    this.invincible = true;
    setTimeout(() => {
      this.invincible = false;
    }, this.INVINCIBLE_TIMER);
    this.healthBar.value -= amount;
  }
  heal(amount: number) {
    this.healthBar.value += amount;
    this.healthBar.value = Math.min(
      this.healthBar.value,
      this.healthBar.maxHealth
    );
  }

  increaseSpeedMult(amount: number) {
    this.speedMult += amount;
    this.speedMult = Math.min(this.speedMult, 2);
    setTimeout(() => {
      this.speedMult -= amount;
      this.speedMult = Math.max(this.speedMult, 1);
    }, 10000);
  }
  increaseDamageMult(amount: number) {
    this.damageMult += amount;
    this.damageMult = Math.min(this.damageMult, 5);
    this.meleeWeapon.damageMult = this.damageMult;
    // Ranged damage mult applied in Projectile class static fn checkPlayerProjectileEffect
    setTimeout(() => {
      this.damageMult -= amount;
      this.damageMult = Math.max(this.damageMult, 1);
      this.meleeWeapon.damageMult = this.damageMult;
    }, 10000);
  }
  increaseMaxHealth(amount: number) {
    this.healthBar.maxHealth += 100 * amount;
    this.healthBar.value += 100 * amount;
    this.healthBar.value = Math.min(
      this.healthBar.value,
      this.healthBar.maxHealth
    );
  }

  setPoisioned() {
    this.isPoisoned = true;
    if (this.isPoisoned && this.disablePoisonTimeoutRef != null) {
      clearTimeout(this.disablePoisonTimeoutRef);
    }
    this.disablePoisonTimeoutRef = setTimeout(() => this.disablePoison(), 1000);
  }

  disablePoison() {
    this.isPoisoned = false;
  }

  update(delta: number) {
    this.handleInput();
    if (!this.inputReceived) {
      this.rigidBody.ax = 0;
    }
    this.rigidBody.update(delta, this.isGrounded);
    this.isGrounded = false;
    // document.rectarray = RectCollider.colliderArray;
    if (this.isPoisoned) {
      this.healthBar.value -= (5 * delta) / 1000;
    }
    // Collision cehck against each tile
    RectCollider.groundColliderArray.forEach((collider) => {
      if (collider.parentObj instanceof Player) return;

      let colliderRect = new Rect2D(
        collider.parentObj.position.x,
        collider.parentObj.position.y,
        collider.width,
        collider.height
      );
      let boolCheck = AABBIntersect(
        new Rect2D(
          this.position.x + this.groundCheckCollider.offsetX,
          this.position.y + this.groundCheckCollider.offsetY,
          this.groundCheckCollider.width,
          this.groundCheckCollider.height
        ),
        colliderRect
      );
      this.isGrounded =
        boolCheck &&
        (!collider.parentObj.oneWay ||
          (this.position.y + this.collider.height - 5 <=
            collider.parentObj.position.y &&
            this.rigidBody.vy >= 0))
          ? true
          : this.isGrounded;

      if (
        AABBIntersect(
          new Rect2D(
            this.position.x,
            this.position.y,
            this.collider.width,
            this.collider.height
          ),
          colliderRect
        )
      ) {
        // collider.debugDraw(ctx);
        let dir = RectCollider.getAABBDirection(this.collider, collider);
        // console.log(dir);
        if (
          dir === "up" &&
          (!collider.parentObj.oneWay ||
            (this.position.y + this.collider.height - 5 <=
              collider.parentObj.position.y &&
              this.rigidBody.vy >= 0))
        ) {
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
    if (this.isGrounded) {
      this.isJumping = false;
      this.isFalling = false;
    }
    if (this.rigidBody.vy > 0) {
      this.isJumping = false;
      this.isFalling = true;
    }
    if (this.isAttackingMelee && this.spriteRenderer.isAnimComplete()) {
      this.spriteRenderer.setRenderOffset(
        new Vect2D(Player.RENDER_OFFSET_X, Player.RENDER_OFFSET_Y)
      );
      this.isAttackingMelee = false;
    }
    if (
      this.isAttackingRanged &&
      this.currentAnim == AnimInfo.bow &&
      this.spriteRenderer.isAnimComplete()
    ) {
      this.isAttackingRanged = false;
      this.shootable = true;
    }
    // if (this.spriteRenderer.isAnimComplete()) {
    //   console.log("complete");
    // }
    // if (this.isAttackingMelee)
    //   console.log(
    //     this.spriteRenderer.isAnimComplete(),
    //     `${this.currentAnim.toString()}`
    //   );

    if (!this.isAttackingMelee && !this.isAttackingRanged) {
      if (!this.flipped && this.rigidBody.vx < 0) this.flipped = true;
      if (this.flipped && this.rigidBody.vx > 0) this.flipped = false;
    }

    if (this.isAttackingMelee) {
      this.meleeWeapon.checkAttack();
      if (this.spriteRenderer.isAnimComplete()) {
        // console.log("reset attack");
        this.spriteRenderer.setRenderOffset(
          new Vect2D(Player.RENDER_OFFSET_X, Player.RENDER_OFFSET_Y)
        );
        this.isAttackingMelee = false;
      }
    }
    this.handleAnimationState();
    this.spriteRenderer.update(delta);
  }

  handleAnimationState() {
    if (
      this.isAttackingMelee &&
      this.currentAnim !== this.meleeWeapon.animInfo
    ) {
      // console.log("anim to attack");
      this.currentAnim = this.meleeWeapon.animInfo;
      this.spriteRenderer.setAnimation(
        this.meleeWeapon.weaponSheet,
        this.meleeWeapon.animInfo,
        true
      );
      return;
    }
    if (this.isAttackingRanged && this.currentAnim !== AnimInfo.bow) {
      // console.log("anim to ranged");
      this.currentAnim = AnimInfo.bow;
      this.spriteRenderer.setAnimation(SpriteImages.bow, AnimInfo.bow, true);
      return;
    }

    if (this.isAttackingMelee || this.isAttackingRanged) {
      return;
    }

    if (
      this.rigidBody.vx === 0 &&
      this.isGrounded &&
      !this.isFalling &&
      !this.isJumping &&
      !(this.isAttackingMelee || this.isAttackingRanged) &&
      this.currentAnim !== AnimInfo.playerIdle
    ) {
      this.currentAnim = AnimInfo.playerIdle;
      // console.log("idle");
      this.spriteRenderer.setAnimation(
        SpriteImages.playerIdle,
        AnimInfo.playerIdle
      );
    }
    if (
      this.rigidBody.vx !== 0 &&
      this.isGrounded &&
      this.currentAnim !== AnimInfo.playerRun
    ) {
      this.currentAnim = AnimInfo.playerRun;
      // console.log("playerRUn");
      this.spriteRenderer.setAnimation(
        SpriteImages.playerRun,
        AnimInfo.playerRun
      );
    }
    // console.log(this.isJumping, this.isFalling);
    if (this.isJumping && this.currentAnim !== AnimInfo.playerJump) {
      this.currentAnim = AnimInfo.playerJump;
      // console.log("playerJump");
      this.spriteRenderer.setAnimation(
        SpriteImages.playerJump,
        AnimInfo.playerJump,
        true
      );
    }
    if (this.isFalling && this.currentAnim !== AnimInfo.playerFall) {
      this.currentAnim = AnimInfo.playerFall;
      // console.log("playerFall");
      this.spriteRenderer.setAnimation(
        SpriteImages.playerFall,
        AnimInfo.playerFall,
        true
      );
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
      Player.SRC_X - Player.RENDER_OFFSET_X,
      Player.SRC_Y - Player.RENDER_OFFSET_Y,
      Player.WIDTH,
      Player.HEIGHT,
      x,
      y,
      Player.WIDTH * scale,
      Player.HEIGHT * scale
    );
  }

  render(ctx: CanvasRenderingContext2D) {
    // ctx.globalAlpha = 0.8;
    // // this.rangedWeapon.debugDraw(ctx);
    // // this.meleeWeapon.debugDraw(ctx, "green");

    // ctx.globalAlpha = 0.2;
    // ctx.fillStyle = "red";
    // // this.collider.debugDraw(ctx, "red");
    // ctx.globalAlpha = 0.5;
    // ctx.fillStyle = "green";
    // this.groundCheckCollider.debugDraw(ctx, "green");
    ctx.globalAlpha = 1;
    this.spriteRenderer.render(ctx);
    this.healthBar.render(ctx);
    if (this.isPoisoned) {
      ctx.drawImage(
        SpriteImages.poisoned,
        0,
        0,
        32,
        32,
        this.position.x + this.collider.width - LevelManager.cameraOffsetX,
        this.position.y - 16 - LevelManager.cameraOffsetY,
        16,
        16
      );
    }
    // healthbar
    ctx.fillStyle = "black";
    ctx.fillRect(16, 16, 32 * 10, 32);
    let percentage = this.healthBar.value / this.healthBar.maxHealth;
    ctx.fillStyle = percentage > 0.2 ? "green" : "red";
    ctx.fillRect(16, 16, 32 * 10 * percentage, 32);
    ctx.textAlign = "left";
    ctx.font = "24px inter";
    ctx.fillStyle = percentage > 0.2 ? "darkgreen" : "red";
    ctx.fillText(
      `${this.healthBar.value.toFixed(0)}/${this.healthBar.maxHealth}`,
      32 * 10 + 32,
      16 + 28
    );

    let meleeName = this.meleeWeapon
      .name as keyof typeof Globals.weaponPickerMap;
    const meleeType = Globals.weaponPickerMap[meleeName];
    meleeType.itemPreview(16, 32 * 2, ctx, meleeType.defaultSprite, 1.5);

    // let arrowName = this.meleeWeapon.constructor
    //   .name as keyof typeof Globals.weaponPickerMap;
    // const arrowType = Globals.weaponPickerMap[meleeName];
    // meleeType.itemPreview(16, 32 * 2, ctx, meleeType.defaultSprite, 1.5);
    // Buffs
    if (this.speedMult != 1) {
      SpeedUp.itemPreview(
        Globals.REF_WIDTH - 52,
        16,
        ctx,
        SpeedUp.defaultSprite,
        1.5
      );
    }
    if (this.damageMult != 1) {
      AtkUp.itemPreview(
        Globals.REF_WIDTH - 52 - 32 * 1.5,
        16,
        ctx,
        AtkUp.defaultSprite,
        1.5
      );
    }
  }
}

export default Player;
