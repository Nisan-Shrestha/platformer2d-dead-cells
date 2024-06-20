import Player from "../entities/Player";
import { Rect2D, ColliderLayer } from "../utils/utils";

class RectCollider {
  layer: ColliderLayer;
  parentObj: any;
  width: number;
  height: number;
  // this offset used only to position the object
  offset: boolean = false;
  offsetX: number = 0;
  offsetY: number = 0;
  static colliderArray: RectCollider[] = [];
  constructor(
    parent: any,
    width: number,
    height: number,
    layer: ColliderLayer,
    offset: boolean = false,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    this.parentObj = parent;
    this.width = width;
    this.height = height;
    this.offset = offset;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    // this.rect = new Rect2D(this.parentObj.position.x, this.parentObj.position.y, rect.width, rect.height, "red", true);
    this.layer = layer;
    RectCollider.colliderArray.push(this);
  }
  static clearAll() {
    RectCollider.colliderArray = [];
  }
  // static canCollide(collider1:RectCollider, collider2:RectCollider){
  //   return (collider1.layer ) != 0;
  // }

  debugDraw(ctx: CanvasRenderingContext2D, color: string = "black") {
    // this.rect.draw(ctx);
    ctx.globalAlpha = .5
    ctx.fillStyle = color;
    ctx.fillRect(
      this.parentObj.position.x +
        (this.offset ? this.offsetX : 0) +
        (this.parentObj instanceof Player ? Player.RENDER_OFFSET_X : 0),
      this.parentObj.position.y +
        (this.offset ? this.offsetY : 0) +
        (this.parentObj instanceof Player ? Player.RENDER_OFFSET_X : 0),
      this.width,
      this.height
    );
    ctx.globalAlpha = 1
    // ctx.fillRect(100,100,100,100)
    // if (this.parentObj instanceof Player) {
    //   console.log(this.width, this.height)

    // }
  }
  //moves colliderA parent position to not collide with colliberB
  static getAABBDirection(A: RectCollider, B: RectCollider): string {
    let aTop = A.parentObj.position.y;
    let aBottom = A.parentObj.position.y + A.height;
    let aLeft = A.parentObj.position.x;
    let aRight = A.parentObj.position.x + A.width;
    let bTop = B.parentObj.position.y;
    let bBottom = B.parentObj.position.y + B.height;
    let bLeft = B.parentObj.position.x;
    let bRight = B.parentObj.position.x + B.width;

    // find overlaps for A
    let topEdgeOverlap =
      (aTop < bBottom && aTop > bTop) || (bBottom > aTop && bBottom < aBottom);
    let bottomEdgeOverlap =
      (aBottom > bTop && aBottom < bBottom) || (bTop < aBottom && bTop > aTop);
    let rightEdgeOverlap =
      (aRight > bLeft && aRight < bRight) || (bLeft < aRight && bLeft > aLeft);
    let leftEdgeOverlap =
      (aLeft < bRight && aLeft > bLeft) || (bRight > aLeft && bRight < aRight);
    // if (bottomEdgeOverlap) {
    //   console.log(aTop, aBottom, aLeft, aRight);
    //   console.log(bTop, bBottom, bLeft, bRight);
    //   console.log(
    //     `topEdgeOverlap: ${topEdgeOverlap},  bottomEdgeOverlap: ${bottomEdgeOverlap},  leftEdgeOverlap: ${leftEdgeOverlap},  rightEdgeOverlap: ${rightEdgeOverlap},  `
    //   );
    // }

    let dx = 0;
    let dy = 0;

    if (rightEdgeOverlap) dx = Math.abs(bLeft - aRight);
    else if (leftEdgeOverlap) dx = Math.abs(bRight - aLeft);

    if (topEdgeOverlap) dy = Math.abs(bBottom - aTop);
    else if (bottomEdgeOverlap) dy = Math.abs(bTop - aBottom);

    // console.log(
    //   `topEdgeOverlap: ${topEdgeOverlap},  bottomEdgeOverlap: ${bottomEdgeOverlap},  leftEdgeOverlap: ${leftEdgeOverlap},  rightEdgeOverlap: ${rightEdgeOverlap},  `
    // );
    if (topEdgeOverlap && bottomEdgeOverlap) {
      if (leftEdgeOverlap && !rightEdgeOverlap) {
        // Abstracted to ResolveRight
        return "right";
      } else if (!leftEdgeOverlap && rightEdgeOverlap) {
        // Abstracted to Resolveleft
        return "left";
      }
    }
    if (leftEdgeOverlap && rightEdgeOverlap) {
      if (topEdgeOverlap && !bottomEdgeOverlap) {
        return "down";
      } else if (!topEdgeOverlap && bottomEdgeOverlap) {
        return "up";
      }
    }
    if (dy <= dx) {
      if (bottomEdgeOverlap && (leftEdgeOverlap || rightEdgeOverlap)) {
        return "up";
      } else if (topEdgeOverlap && (leftEdgeOverlap || rightEdgeOverlap)) {
        return "down";
      }
    } else {
      if (leftEdgeOverlap && (bottomEdgeOverlap || topEdgeOverlap)) {
        return "right";
      } else if (rightEdgeOverlap && (bottomEdgeOverlap || topEdgeOverlap)) {
        return "left";
      }
    }
    console.log(aTop, aBottom, aLeft, aRight);
    console.log(bTop, bBottom, bLeft, bRight);
    console.log(
      `topEdgeOverlap: ${topEdgeOverlap},  bottomEdgeOverlap: ${bottomEdgeOverlap},  leftEdgeOverlap: ${leftEdgeOverlap},  rightEdgeOverlap: ${rightEdgeOverlap},  `
    );
    return "none";
  }

  static ResolveRight(colliderA: RectCollider, colliderB: RectCollider) {
    colliderA.parentObj.position.x =
      colliderB.parentObj.position.x + colliderB.width;
  }
  static ResolveLeft(colliderA: RectCollider, colliderB: RectCollider) {
    colliderA.parentObj.position.x =
      colliderB.parentObj.position.x - colliderA.width;
  }
  static ResolveDown(colliderA: RectCollider, colliderB: RectCollider) {
    colliderA.parentObj.position.y =
      colliderB.parentObj.position.y + colliderB.height;
  }
  static ResolveUp(colliderA: RectCollider, colliderB: RectCollider) {
    colliderA.parentObj.position.y =
      colliderB.parentObj.position.y - colliderA.height;
  }
}

export default RectCollider;
