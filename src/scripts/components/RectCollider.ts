import { Rect2D, ColliderLayer } from "../utils/utils";

class RectCollider {
  layer: ColliderLayer;
  parentObj: any;
  width: number;
  height: number;
  static colliderArray: RectCollider[] = [];
  constructor(
    parent: any,
    width: number,
    height: number,
    layer: ColliderLayer
  ) {
    this.parentObj = parent;
    this.width = width;
    this.height = height;
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

  debugDraw(ctx: CanvasRenderingContext2D) {
    // this.rect.draw(ctx);
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.parentObj.position.x,
      this.parentObj.position.y,
      this.width,
      this.height
    );
  }
  //moves colliderA parent position to not collide with colliberB
  static getAABBDirection(
    colliderA: RectCollider,
    colliderB: RectCollider
  ): string {
    let aTop = colliderA.parentObj.position.y;
    let aBottom = colliderA.parentObj.position.y + colliderA.height;
    let aLeft = colliderA.parentObj.position.x;
    let aRight = colliderA.parentObj.position.x + colliderA.width;

    let bTop = colliderB.parentObj.position.y;
    let bBottom = colliderB.parentObj.position.y + colliderB.height;
    let bLeft = colliderB.parentObj.position.x;
    let bRight = colliderB.parentObj.position.x + colliderB.width;

    // find overlaps for A
    let topEdgeOverlap = aTop < bBottom && aTop > bTop;
    let bottomEdgeOverlap = aBottom > bTop && aBottom < bBottom;
    let rightEdgeOverlap = aRight > bLeft && aRight < bRight;
    let leftEdgeOverlap = aLeft < bRight && aLeft > bLeft;

    let dx = 0;
    let dy = 0;

    if (rightEdgeOverlap) dx = Math.abs(bLeft - aRight);
    else if (leftEdgeOverlap) dx = Math.abs(bRight - aLeft);

    if (topEdgeOverlap) dy = Math.abs(bBottom - aTop);
    else if (bottomEdgeOverlap) dy = Math.abs(bTop - aBottom);

    console.log(
      `topEdgeOverlap: ${topEdgeOverlap},  bottomEdgeOverlap: ${bottomEdgeOverlap},  leftEdgeOverlap: ${leftEdgeOverlap},  rightEdgeOverlap: ${rightEdgeOverlap},  `
    );
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
