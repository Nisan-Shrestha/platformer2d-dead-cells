import { Rect2D } from "../utils/utils";
class Button {
  text: string = "";
  rect: Rect2D;
  onClick: () => void;
  active: boolean;
  spriteBased: boolean = false;
  constructor(text: string, rect: Rect2D, onClick: () => void, active: boolean = true) {
    this.text = text;
    this.rect = rect;
    this.onClick = onClick;
    this.active = active;
  }

  renderButton(ctx: CanvasRenderingContext2D, color: string = "white", textColor: string = "black") {
    ctx.fillStyle = color;
    ctx.fillRect(
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height
    );
    ctx.fillStyle = textColor;
    ctx.font = "20px Arial";
    ctx.fillText(
      this.text,
      this.rect.x +
        this.rect.width / 2 -
        ctx.measureText(this.text).width / 2,
      this.rect.y + this.rect.height / 2 + 8
    );
  }
}
