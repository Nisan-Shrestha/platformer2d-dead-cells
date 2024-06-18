import Constants from "../utils/constants";
import { IKeymap, Rect2D, Vect2D } from "../utils/utils";
import RigidBody from "../components/RigidBody";
import { SpriteRenderer } from "../components/SpriteRenderer";
class Player {
  keymap: IKeymap;
  rect: Rect2D;
  rigidBody: RigidBody;
  moveSpeed: number;
  spriteRenderer: SpriteRenderer;
  inputReceived: boolean = false;
  tilted: boolean = false;
  keysPressed = new Set<string>();
  isGrounded = false;
  ctx: CanvasRenderingContext2D;
  constructor(
    keymap: IKeymap,
    x: number,
    y: number,
    width: number,
    height: number,
    sourceImgElement: HTMLImageElement,
    spritePosArray: Vect2D[],
    ctx: CanvasRenderingContext2D
  ) {
    this.rect = new Rect2D(x, y, width, height, "red", true);
    this.rigidBody = new RigidBody(this.rect);
    this.rigidBody.dragX = 0.1;
    this.rigidBody.gravity = 3000;
    this.spriteRenderer = new SpriteRenderer(
      this.rect,
      sourceImgElement,
      false,
      1,
      spritePosArray
    );
    this.ctx = ctx;
    this.moveSpeed = Constants.PLAYER_MOVE_SPEED_X;
    this.keymap = keymap;
    this.setupControls();
  }

  addKey(e: KeyboardEvent) {
    this.keysPressed.add(e.key);
  }
  removeKey(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);
  }

  handleTilt(event: DeviceOrientationEvent) {
    let gam = event.gamma as number;
    if (gam < -15) {
      this.moveLeft(gam / 60);
      this.tilted = true;
    } else if (gam > 15) {
      this.tilted = true;
      this.moveRight(gam / 60);
    } else {
      this.tilted = false;
    }
  }

  setupControls() {
    window.addEventListener("keydown", (e) => this.addKey(e));
    window.addEventListener("keyup", (e) => this.removeKey(e));

    // Event listener for device orientation
    // this.ctx.fillText("left", 10, 120);
    if (window.DeviceOrientationEvent) {
      console.log("DeviceOrientation is supported");
    } else {
      console.log("DeviceOrientation is not supported");
    }
    window.addEventListener("deviceorientation", (event) =>
      this.handleTilt(event)
    );

    console.log("DeviceOrientation event listener added");
  }

  handleInput() {
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
    this.rigidBody.ax = -Constants.PLAYER_MOVE_SPEED_X * 3000 * value;
    // console.log("234567890-");
  }
  moveRight(value: number = 1) {
    this.rigidBody.ax = Constants.PLAYER_MOVE_SPEED_X * 3000 * value;
  }
  jump() {
    this.rigidBody.vy = -1000;
  }

  update(delta: number) {
    this.handleInput();
    if (!this.inputReceived && !this.tilted) {
      this.rigidBody.ax = 0;
    }
    if (this.isGrounded) {
      this.jump();
    }
    this.rigidBody.update(delta);
    if (this.rigidBody.vx > 0) {
      this.spriteRenderer.setStaticSourceOffset(
        new Vect2D(this.spriteRenderer.sourceFrameWidth * 1, 0)
      );
    } else if (this.rigidBody.vx < 0) {
      this.spriteRenderer.setStaticSourceOffset(
        new Vect2D(this.spriteRenderer.sourceFrameWidth * 0, 0)
      );
    }
    if (this.rect.x < 0) this.rect.x += this.ctx.canvas.width;
    if (this.rect.x > this.ctx.canvas.width)
      this.rect.x -= this.ctx.canvas.width;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.spriteRenderer.render(ctx);
  }
}

export default Player;
