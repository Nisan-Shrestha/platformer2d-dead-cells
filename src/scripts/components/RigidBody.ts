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
    this.parent.position.x += this.vx * delta;
    this.parent.position.y += this.vy * delta;
  }
}

export default RigidBody;
