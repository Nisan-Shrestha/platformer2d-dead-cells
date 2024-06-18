import Constants from "../utils/constants";
import { SpriteImages } from "../utils/ImageRepo";
import LevelMaker from "./LevelMaker";
//sprites defination

window.onload = () => setupCanvas();

const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

export { ctx };

function setupCanvas() {
  if (canvas.parentElement) {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    console.log(canvas.width, canvas.height, Constants.scale);
    if (
      canvas.width / canvas.height <
      Constants.REF_WIDTH / Constants.REF_HEIGHT
    ) {
      canvas.height =
        canvas.width * (Constants.REF_HEIGHT / Constants.REF_WIDTH);
    } else {
      canvas.width =
        canvas.height * (Constants.REF_WIDTH / Constants.REF_HEIGHT);
    }
    // ctx.scale(canvas.width / REF_WIDTH, canvas.height / REF_HEIGHT);
    Constants.scale = canvas.width / Constants.REF_WIDTH;
    ctx.scale(Constants.scale, Constants.scale);

    console.log(
      canvas.width / Constants.scale,
      canvas.height / Constants.scale,
      Constants.scale
    );
    canvas.style.background = "grey";

  }
  let levEditor = new LevelMaker();
  levEditor.loadEditor();
}
