import { Vect2D } from "../utils/utils";
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
    vx: number = 0,
    vy: number = 0,
    ax: number = 0,
    ay: number = 0,
    dragX: number = 0,
    dragY: number = 0
  ) {
    this.parent = parent;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.dragX = dragX;
    this.dragY = dragY;
  }

  update(delta: number) {
    this.vx *= 1 - this.dragX;
    this.vy *= 1 - this.dragY;
    this.vx += this.ax * delta;
    this.vy += this.ay * delta;
    this.vy += this.gravity * delta;

    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vy) < 0.01) this.vy = 0;
    this.vx = this.vx > 0.255 ? 0.255 : this.vx < -0.255 ? -0.255 : this.vx;
    // this.vy = this.vy > 0.255 ? 0.255 : this.vy < -0.255 ? -0.255 : this.vy;
    // console.log(this.vx, this.vy);
    this.parent.position.x += this.vx * delta;
    this.parent.position.y += this.vy * delta;
  }
}

export default RigidBody;
