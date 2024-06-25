import { SpriteImages } from "../utils/ImageRepo";
class Eraser {
  static WIDTH = 32 * 1;
  static HEIGHT = 32 * 1;
  static SRC_X = 0;
  static SRC_Y = 0;
  static SRC_WIDTH = 32;
  static SRC_HEIGHT = 32;
  static defaultSprite: HTMLImageElement = SpriteImages.eraserSprite;
  // collider: RectCollider;

  constructor() {
    console.log("You should Erase whatevers causing this to be logged!");
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
