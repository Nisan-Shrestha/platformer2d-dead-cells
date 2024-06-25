import SpriteRenderer from "../components/SpriteRenderer";
import LevelManager from "../main/LevelManager";
import { AnimInfo } from "../utils/AnimationInfo";
import { Vect2D } from "../utils/utils";

export default class Pickable {
  name: string;
  description: string;
  position: Vect2D;
  RangeSize: Vect2D;
  spriteRenderer: SpriteRenderer;
  icon: HTMLImageElement;
  iconSize: Vect2D;
  static AllPickables: Pickable[] = [];
  constructor(
    name: string,
    description: string,
    position: Vect2D,
    rangeSize: Vect2D,
    icon: HTMLImageElement,
    iconSize: Vect2D = new Vect2D(32, 32)
  ) {
    this.name = name;
    this.description = description;
    this.position = position;
    this.RangeSize = rangeSize;
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
    Pickable.AllPickables.push(this);
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.spriteRenderer.render(ctx);
    // console.log("Rendering Pickable");
  }
  renderDescription(ctx: CanvasRenderingContext2D): void {
    let fontSize = 12;
    ctx.font = `${fontSize}px monospace`;
    let textW = ctx.measureText(this.description).width;
    let maxWidth = 94;
    let lines = 2 + Math.ceil(textW / (maxWidth - fontSize));
    let textHeight = lines * (fontSize + 2);
    let rectHeight = textHeight + 8;
    let t = ctx.globalAlpha;
    let px =
      this.position.x -
      LevelManager.cameraOffsetX -
      maxWidth / 2 +
      this.spriteRenderer.width / 2 -
      3;
    console.log(lines);
    let py = this.position.y - LevelManager.cameraOffsetY - 16 - rectHeight;
    // Draw border
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(px, py, maxWidth + 8, lines * fontSize + 8);
    ctx.strokeStyle = "black";
    ctx.strokeRect(px, py + fontSize, maxWidth + 8, 1);
    // Draw background
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "white";
    ctx.fillRect(px + 1, py + 1, maxWidth + 8 - 2, lines * fontSize + 6);
    // Write Text
    ctx.globalAlpha = 1;

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    py += fontSize / 2;
    ctx.fillText(this.name, px + maxWidth / 2 + 4, py + 4);
    py += fontSize / 2;

    ctx.textAlign = "left";
    let words = this.description.split(" ");
    let line = words[0];
    for (let n = 1; n < words.length; n++) {
      let testWidth = ctx.measureText(line + words[n]).width;
      if (testWidth > maxWidth) {
        ctx.fillText(line, px + 3, py + fontSize, maxWidth);
        line = words[n];
        py += fontSize;
      } else {
        line += " " + words[n];
      }
    }
    ctx.fillText(line, px + 3, py + 3 + fontSize);
    py += fontSize;
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    py += fontSize / 2;
    ctx.strokeRect(px, py, maxWidth + 6, 1);
    py += fontSize;
    ctx.fillText("E to Use", px + 3 + maxWidth / 2, py);
    // ctx.fillText(this.description, px + 3, py + 3 + fontSize);

    ctx.globalAlpha = t;
  }

  delete(): void {
    let index = Pickable.AllPickables.indexOf(this);
    Pickable.AllPickables.splice(index, 1);
  }

  onPickUp(): void {
    console.log("This pickable: ", this.name, " needs a onPickUp fn");
    this.delete();
  }
}
