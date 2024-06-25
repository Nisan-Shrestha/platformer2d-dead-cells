import SpriteRenderer from "./SpriteRenderer";

export default class HealthBar {
  parent: any;
  maxHealth: number = 100;
  value: number = 100;
  constructor(parent: any, maxHealth: number = 100) {
    this.parent = parent;
    this.maxHealth = maxHealth;
    this.value = maxHealth;
  }
  render(ctx: CanvasRenderingContext2D) {
    this.value = Math.max(0, this.value);
    // this.health -= this.parent.health;
    SpriteRenderer.drawOffsetRect(
      ctx,
      this.parent.position.x,
      this.parent.position.y - 10,
      this.parent.collider.width,
      5,
      "lightgrey"
    );
    let percentage = this.value / this.maxHealth;

    SpriteRenderer.drawOffsetRect(
      ctx,
      this.parent.position.x,
      this.parent.position.y - 10,
      this.parent.collider.width * percentage,
      5,
      percentage > 0.2 ? "green" : "red"
    );
  }
}
