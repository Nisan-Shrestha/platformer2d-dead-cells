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
class Player {
  //max Sprite Width and height
  static WIDTH = 32 * 1;
  static HEIGHT = 32 * 1;
  static SRC_X = 32 * 1;
  static SRC_Y = 0;
  static SRC_WIDTH = 32 * 1;
  static SRC_HEIGHT = 32 * 1;
  keymap: IKeymap;
  // rect: Rect2D;
  rigidBody: RigidBody;
  position: Vect2D;
  collider: RectCollider;
  moveSpeed: number;
  spriteRenderer: SpriteRenderer;
  inputReceived: boolean = false;
  tilted: boolean = false;
  keysPressed = new Set<string>();
  isGrounded = false;
  // groundCheckCollider = RectCollider;
  constructor(pos: Vect2D, sourceImgElement: HTMLImageElement) {
    this.position = new Vect2D(pos.x, pos.y);

    this.rigidBody = new RigidBody(this);
    this.rigidBody.dragX = 0.1;
    this.rigidBody.gravity = 3 / 10000;
    this.collider = new RectCollider(
      this,
      Player.WIDTH,
      Player.HEIGHT,
      ColliderLayer.Player
    );
    this.spriteRenderer = new SpriteRenderer(
      this,
      Player.WIDTH,
      Player.HEIGHT,
      sourceImgElement,
      false,
      1,
      [new Vect2D(Player.SRC_X, Player.SRC_Y)]
    );
    this.moveSpeed = Constants.PLAYER_MOVE_SPEED_X;
    this.keymap = {
      left: "a",
      right: "d",
      fire: "k",
    };
  }

  assignKeySet(keySet: Set<string>) {
    this.keysPressed = keySet;
  }

  handleInput() {
    // console.log(this.keysPressed);

    this.inputReceived = false;
    if (
      this.keysPressed.has(this.keymap.left) ||
      this.keysPressed.has("ArrowLeft")
    ) {
      this.moveLeft();
      this.inputReceived = true;
    }

    if (
      this.keysPressed.has(this.keymap.right) ||
      this.keysPressed.has("ArrowRight")
    ) {
      this.moveRight();
      this.inputReceived = true;
    }

    if (this.keysPressed.has(this.keymap.fire)) {
      // this.jump();
      // this.inputReceived = true;
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
    this.rigidBody.vy = -1 / 100;
  }

  update(delta: number) {
    this.handleInput();
    if (!this.inputReceived) {
      this.rigidBody.ax = 0;
    }
    this.rigidBody.update(delta);
    // document.rectarray = RectCollider.colliderArray;
    RectCollider.colliderArray.forEach((collider) => {
      if (collider.parentObj instanceof Player) {
        return;
      }
      if (
        AABBIntersect(
          new Rect2D(
            this.position.x,
            this.position.y,
            this.collider.width,
            this.collider.height
          ),
          new Rect2D(
            collider.parentObj.position.x,
            collider.parentObj.position.y,
            collider.width,
            collider.height
          )
        )
      ) {
        let dir = RectCollider.getAABBDirection(this.collider, collider);
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
            this.isGrounded = true;
          }
        }
      }
      // console.log( collider.parentObj.name);
    });

    this.spriteRenderer.update(delta);
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
    this.spriteRenderer.render(ctx);
  }
}

export default Player;
