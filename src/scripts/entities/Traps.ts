import RectCollider from "../components/RectCollider";
import SpriteRenderer from "../components/SpriteRenderer";
import { AnimInfo } from "../utils/AnimationInfo";
import { ColliderLayer, Vect2D } from "../utils/utils";

export default class Trap {
  name: string;
  position: Vect2D;
  collider: RectCollider;
  spriteRenderer: SpriteRenderer;
  icon: HTMLImageElement;
  iconSize: Vect2D;
  active: boolean = true;
  static AllTraps: Trap[] = [];
  constructor(
    name: string,
    position: Vect2D,
    colliderSize: Vect2D,
    icon: HTMLImageElement,
    iconSize: Vect2D = new Vect2D(32, 32)
  ) {
    this.name = name;
    this.position = position;
    this.icon = icon;
    this.iconSize = iconSize;
    this.spriteRenderer = new SpriteRenderer(
      this,
      iconSize.x,
      iconSize.y,
      icon,
      false,
      AnimInfo.base
    );
    this.collider = new RectCollider(
      this,
      colliderSize.x,
      colliderSize.y,
      ColliderLayer.Traps
    );
    Trap.AllTraps.push(this);
  }

  public getName(): string {
    return this.name;
  }
  setActive(active: boolean) {
    this.active = active;
  }

  update(delta: number) {
    this.spriteRenderer.update(delta);
    return;
  }
  render(ctx: CanvasRenderingContext2D): void {
    this.spriteRenderer.render(ctx);
    // console.log("Rendering Trap");
  }
  static ClearAll() {
    Trap.AllTraps = [];
  }
  OnHit() {
    console.log("Trap Hit: " + this.name, " needs a OnHit fn Override");
  }
}
