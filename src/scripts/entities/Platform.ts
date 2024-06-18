import { Rect2D } from "../utils/utils";
import RectCollider from "../components/RectCollider";
import SpriteRenderer from "../components/SpriteRenderer";
import { Vect2D } from "../utils/utils";
class Platform {
  rect: Rect2D;
  collider: RectCollider;
  spriteRenderer: SpriteRenderer; // Added sprite renderer property

  constructor(x: number, y: number, width: number, height: number, spriteImage: HTMLImageElement) {
    this.rect = new Rect2D(x, y, width, height, "blue", true);
    this.collider = new RectCollider(this.rect, 1);
    this.spriteRenderer = new SpriteRenderer(new Rect2D(x, y, width, height), spriteImage, false, 1, [new Vect2D(0, 0)]);

    // Set sprite renderer properties
    
  }

  setColliderRect(x: number, y: number, width: number, height: number) {
    this.collider.rect.x = x;
    this.collider.rect.y = y;
    this.collider.rect.width = width;
    this.collider.rect.height = height;
  }
}

export default Platform;