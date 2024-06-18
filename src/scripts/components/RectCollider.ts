import { Rect2D, ColliderLayer } from '../utils/utils';



class RectCollider {
  rect: Rect2D;
  layer: ColliderLayer;
  static colliderArray: RectCollider[] = [];
  constructor(rect:Rect2D, layer:ColliderLayer) {
    RectCollider.colliderArray.push(this);
    this.rect = rect;
    this.layer = layer;
  }

  // static canCollide(collider1:RectCollider, collider2:RectCollider){
  //   return (collider1.layer ) != 0;
  // }

  debugDraw(ctx:CanvasRenderingContext2D){
    this.rect.draw(ctx);
  }
}

export default RectCollider;