import Player from "../entities/Player";
import Globals from "../utils/constants";
export class RigidBody {
  parent: any;
  vx: number = 0;
  vy: number = 0;
  ax: number = 0;
  ay: number = 0;
  dragX: number = 0;
  dragY: number = 0;
  gravity: number = 0;
  constructor(
    parent: any,
    dragX: number = 0,
    dragY: number = 0,
    vx: number = 0,
    vy: number = 0,
    ax: number = 0,
    ay: number = 0
  ) {
    this.parent = parent;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.dragX = dragX;
    this.dragY = dragY;
    this.gravity = Globals.GRAVITY
  }

  update(delta: number, isGrounded: boolean = true) {
    // if (isGrounded || this.parent?.isAttackingMelee)
    this.vx *= 1 - this.dragX;
    // else this.vx *= (1 - this.dragX/2)
    this.vy *= 1 - this.dragY;
    this.vx += this.ax * delta;
    this.vy += this.ay * delta;
    if (!isGrounded) this.vy += this.gravity * delta;

    if (this.parent instanceof Player && Math.abs(this.vx) < 0.01) this.vx = 0;
    else if (Math.abs(this.vx) < 0.001) this.vx = 0;
    if (Math.abs(this.vy) < 0.0001) this.vy = 0;
    this.vx = this.vx > 0.5 ? 0.5 : this.vx < -0.5 ? -0.5 : this.vx;
    // this.vy = this.vy > 0.255 ? 0.255 : this.vy < -0.255 ? -0.255 : this.vy;
    // console.log(this.vx, this.vy);
    this.parent.position.x += this.vx * delta;
    this.parent.position.y += this.vy * delta;
  }
}

export default RigidBody;
