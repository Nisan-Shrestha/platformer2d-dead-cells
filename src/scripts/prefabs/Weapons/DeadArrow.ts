import RectCollider from "../../components/RectCollider";
import Projectile from "../../components/WeaponBase/Projectile";
import { AnimInfo } from "../../utils/AnimationInfo";
import { SpriteImages } from "../../utils/ImageRepo";
import { ColliderLayer, Vect2D } from "../../utils/utils";

// Arrow class for enemy archer.
export default class DeadArrow extends Projectile {
  collider: RectCollider = new RectCollider(
    this,
    10,
    10,
    ColliderLayer.EnemyProjectile
  );
  constructor(position: Vect2D, velocity: Vect2D, flipped: boolean) {
    super(
      "deadArrow",
      20,
      SpriteImages.normalArrowIcon,
      AnimInfo.base,
      SpriteImages.normalArrowIcon,
      position,
      new Vect2D(32, 9),
      new Vect2D(91, 25),
      velocity,
      flipped
    );
    this.collider.width = this.spriteRenderer.width;
    this.collider.height = this.spriteRenderer.height;
  }
}
