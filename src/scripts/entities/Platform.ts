import { ColliderLayer, Rect2D } from "../utils/utils";
import RectCollider from "../components/RectCollider";
import SpriteRenderer from "../components/SpriteRenderer";
import { Vect2D } from "../utils/utils";
class Platform {
  position: Vect2D;
  collider: RectCollider;
  spriteRenderer: SpriteRenderer; // Added sprite renderer property

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    spriteImage: HTMLImageElement
  ) {
    this.position = new Vect2D(x, y);
    this.collider = new RectCollider(this, width, height, ColliderLayer.Ground);
    this.spriteRenderer = new SpriteRenderer(
      this,
      width,
      height,
      spriteImage,
      false,
      1,
      [new Vect2D(0, 0)]
    );
    // Set sprite renderer properties
  }

  setColliderRectSize(width: number, height: number) {
    this.collider.width = width;
    this.collider.height = height;
  }
}

export default Platform;
