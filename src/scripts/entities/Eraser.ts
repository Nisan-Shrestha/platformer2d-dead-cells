import { Rect2D } from "../utils/utils";
import RectCollider from "../components/RectCollider";
import SpriteRenderer from "../components/SpriteRenderer";
import { Vect2D } from "../utils/utils";
class Eraser {
  static WIDTH = 32 * 1;
  static HEIGHT = 32 * 1;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 32;
  static SRC_HEIGHT = 32;

  position: Vect2D;
  // collider: RectCollider;
  spriteRenderer: SpriteRenderer; // Added sprite renderer property

  constructor(
    x: number,
    y: number,
    scale: number,
    spriteImage: HTMLImageElement
  ) {
    // this.rect = new Rect2D(
    //   x,
    //   y,
    //   Eraser.WIDTH * scale,
    //   Eraser.HEIGHT * scale,
    //   "blue",
    //   true
    // );
    this.position = new Vect2D(x, y);
    // this.collider = new RectCollider(this.rect, 1);
    this.spriteRenderer = new SpriteRenderer(
      this,
      Eraser.WIDTH,
      Eraser.HEIGHT,
      spriteImage,
      false,
      1,
      [new Vect2D(0, 0)]
    );

    // Set sprite renderer properties
  }

  // setColliderRect(x: number, y: number, width: number, height: number) {
  //   this.collider.rect.x = x;
  //   this.collider.rect.y = y;
  //   this.collider.rect.width = width;
  //   this.collider.rect.height = height;
  // }

  static itemPreview(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    Image: HTMLImageElement,
    scale: number = 1
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, Eraser.WIDTH * scale, Eraser.HEIGHT * scale);
    ctx.drawImage(
      Image,
      Eraser.SRC_X,
      Eraser.SRC_Y,
      Eraser.SRC_WIDTH,
      Eraser.SRC_HEIGHT,
      x,
      y,
      Eraser.WIDTH * scale,
      Eraser.HEIGHT * scale
    );
  }
}

export default Eraser;
