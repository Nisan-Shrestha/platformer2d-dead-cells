import RectCollider from "../components/RectCollider";
import SpriteRenderer from "../components/SpriteRenderer";
import LevelManager from "../main/LevelManager";
import { ColliderLayer, Vect2D } from "../utils/utils";
class Platform {
  position: Vect2D;
  collider: RectCollider;
  spriteRenderer: SpriteRenderer; // Added sprite renderer property
  oneWay: boolean = false;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    spriteImage: HTMLImageElement,
    oneWay: boolean = false
  ) {
    this.position = new Vect2D(x, y);
    this.collider = new RectCollider(this, width, height, ColliderLayer.Ground);
    this.spriteRenderer = new SpriteRenderer(
      this,
      width,
      height,
      spriteImage,
      false
    );
    this.oneWay = oneWay;
    LevelManager.envElementArr.push(this);

    // Set sprite renderer properties
  }

  setColliderRectSize(width: number, height: number) {
    this.collider.width = width;
    this.collider.height = height;
  }
}

export default Platform;
