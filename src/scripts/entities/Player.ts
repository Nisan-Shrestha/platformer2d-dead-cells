import Constants from "../utils/constants";
import {
  AABBIntersect,
  ColliderLayer,
  IKeymap,
  Rect2D,
  Vect2D,
} from "../utils/utils";
import RigidBody from "../components/RigidBody";
import { SpriteRenderer } from "../components/SpriteRenderer";
import RectCollider from "../components/RectCollider";
import { SpriteImages } from "../utils/ImageRepo";
import { ctx } from "../main/main";
import { AnimInfo } from "../utils/AnimationInfo";
class Player {
  //max Sprite Width and height
  static WIDTH: number = 158 * 1;
  static HEIGHT = 100 * 1;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 158 * 1;
  static SRC_HEIGHT = 100 * 1;
  static RENDER_OFFSET_X = -0;
  static RENDER_OFFSET_Y = -44.5;

  // rect: Rect2D;
  // INFO: States
  flipped: boolean = false;
  isGrounded: boolean = false;
  inputReceived: boolean = false;
  keysPressed = new Set<string>();

  // Components
  position: Vect2D;
  rigidBody: RigidBody;
  collider: RectCollider;
  groundCheckCollider: RectCollider;
  spriteRenderer: SpriteRenderer;
  // Magic Numbers
  moveSpeed: number;
  keymap: Partial<IKeymap> = {
    left: "a",
    right: "d",
    jump: "w",
  };
  //CONSTRUCTOR
  constructor(pos: Vect2D, sourceImgElement: HTMLImageElement) {
    this.position = new Vect2D(pos.x, pos.y);

    this.rigidBody = new RigidBody(this);
    this.rigidBody.dragX = Constants.PLAYER_DRAG_X;
    this.rigidBody.gravity = Constants.GRAVITY;
    this.collider = new RectCollider(
      this,
      32,
      54,
      ColliderLayer.Player,
      false,
      0,
      0
    );
    this.groundCheckCollider = new RectCollider(
      this,
      this.collider.width / 2,
      10,
      ColliderLayer.Player,
      true,
      this.collider.width / 4,
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
    this.moveSpeed = Constants.PLAYER_MOVE_SPEED_X;
  }

  assignKeySet(keySet: Set<string>) {
    this.keysPressed = keySet;
  }

  handleInput() {
    // console.log(this.keysPressed);

    this.inputReceived = false;
    if (
      (this.keymap.left && this.keysPressed.has(this.keymap.left)) ||
      this.keysPressed.has("ArrowLeft")
    ) {
      this.moveLeft();
      this.inputReceived = true;
    }

    if (
      (this.keymap.right && this.keysPressed.has(this.keymap.right)) ||
      this.keysPressed.has("ArrowRight")
    ) {
      this.moveRight();
      this.inputReceived = true;
    }

    if (
      this.keymap.jump &&
      this.keysPressed.has(this.keymap.jump) &&
      this.isGrounded
    ) {
      console.log("jump", this.isGrounded);
      this.jump();
      this.inputReceived = true;
    }
  }

  moveLeft(value: number = 1) {
    this.rigidBody.ax = ((-Constants.PLAYER_MOVE_SPEED_X * 3) / 100) * value;
    // console.log("234567890-");
  }
  moveRight(value: number = 1) {
    this.rigidBody.ax = ((Constants.PLAYER_MOVE_SPEED_X * 3) / 100) * value;
  }
  jump() {
    this.rigidBody.vy = -Constants.PLAYER_JUMP_POWER;
  }

  update(delta: number) {
    this.handleInput();
    if (!this.inputReceived) {
      this.rigidBody.ax = 0;
    }
    this.isGrounded = false;
    this.rigidBody.update(delta);
    // document.rectarray = RectCollider.colliderArray;
    RectCollider.colliderArray.forEach((collider) => {
      if (collider.parentObj instanceof Player) {
        return;
      }
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
      this.isGrounded = boolCheck ? true : this.isGrounded;
      // if (boolCheck) {
      //   console.log(
      //     this.isGrounded,
      //     colliderRect,
      //     this.position.x + this.groundCheckCollider.offsetX,
      //     this.position.y + this.groundCheckCollider.offsetY
      //   );
      // }
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
        collider.debugDraw(ctx);
        let dir = RectCollider.getAABBDirection(this.collider, collider);
        // console.log(dir);
        if (dir === "right") {
          if (collider.layer === ColliderLayer.Ground) {
            RectCollider.ResolveRight(this.collider, collider);
            this.rigidBody.vx = 0;
          }
        } else if (dir === "left") {
          if (collider.layer === ColliderLayer.Ground) {
            RectCollider.ResolveLeft(this.collider, collider);
            this.rigidBody.vx = 0;
          }
        } else if (dir === "up") {
          if (collider.layer === ColliderLayer.Ground) {
            RectCollider.ResolveUp(this.collider, collider);
            this.rigidBody.vy = 0;
          }
        } else if (dir === "down") {
          if (collider.layer === ColliderLayer.Ground) {
            RectCollider.ResolveDown(this.collider, collider);
            this.rigidBody.vy = 0;
            // this.isGrounded = true;
          }
        }
      }
      // console.log( collider.parentObj.name);
    });
    if(!this.flipped && this.rigidBody.vx < 0) this.flipped = true;
    if(this.flipped && this.rigidBody.vx > 0) this.flipped = false;
    this.handleAnimationState();
    this.spriteRenderer.update(delta);
  }

  handleAnimationState() {
    if (this.rigidBody.vx === 0 && this.isGrounded) {
      this.spriteRenderer.setAnimation(
        SpriteImages.playerIdle,
        AnimInfo.playerIdle
      );
    } else {
      // console.log(this.rigidBody.vx)
      this.spriteRenderer.setAnimation(
        SpriteImages.playerRun,
        AnimInfo.playerRun
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
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, Player.WIDTH * scale, Player.HEIGHT * scale);
    ctx.drawImage(
      Image,
      Player.SRC_X,
      Player.SRC_Y,
      Player.SRC_WIDTH,
      Player.SRC_HEIGHT,
      x,
      y,
      Player.WIDTH * scale,
      Player.HEIGHT * scale
    );
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 0.5;
    // ctx.fillRect(
    //   this.position.x + Player.RENDER_OFFSET_X,
    //   this.position.y + Player.RENDER_OFFSET_Y,
    //   Player.WIDTH,
    //   Player.HEIGHT
    // );
    // console.log(this.position.x, this.position.y, Player.WIDTH, Player.HEIGHT);
    // this.spriteRenderer.debugDraw(ctx);
    ctx.fillStyle = "red";
    this.collider.debugDraw(ctx, "red");
    ctx.globalAlpha = 1;
    this.spriteRenderer.render(ctx);
    ctx.fillStyle = "green";
    this.groundCheckCollider.debugDraw(ctx, "green");
  }
}

export default Player;
