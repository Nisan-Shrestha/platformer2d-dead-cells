import Globals from "../utils/constants";
import { SpriteImages } from "../utils/ImageRepo";
import { GameState, IMenuButton, Rect2D } from "../utils/utils";
import LevelMaker from "./LevelMaker";
import LevelManager from "./LevelManager";
const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas"
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
//sprites defination
// export let
if (canvas.parentElement) {
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.font = "128px monospace";
ctx.fillText("Downloading Assets...", canvas.width / 2, canvas.height / 2);

export function tryLoadMainMenu(event: KeyboardEvent) {
  if (event.key === "Escape") {
    document.removeEventListener("keydown", tryLoadMainMenu);
    loadMainMenu();
  }
}
document.addEventListener("contextmenu", (event) => event.preventDefault());

window.onload = () => {
  setupCanvas();
  setupGlobalControls();
  loadMainMenu();
};

let levelMaker: LevelMaker;
let levelManager: LevelManager;

const menuButtons: IMenuButton[] = [
  {
    // Level 1
    rect: new Rect2D(54, 227, 151, 137),
    onClick: () => {
      document.removeEventListener("click", setupMenuButtons);
      levelManager.loadLevel("Level1");
    },
  },
  {
    // Level 2
    rect: new Rect2D(54, 375, 151, 137),
    onClick: () => {
      document.removeEventListener("click", setupMenuButtons);
      levelManager.loadLevel("Level2");
    },
  },
  {
    // Level 3
    rect: new Rect2D(54, 474, 151, 137),
    onClick: () => {
      document.removeEventListener("click", setupMenuButtons);
      levelManager.loadLevel("Level3");
    },
  },
  {
    // Survival Level
    rect: new Rect2D(54, 576, 151, 137),
    onClick: () => {
      document.removeEventListener("click", setupMenuButtons);
      levelManager.loadLevel("Survival", false, true);
    },
  },
  {
    //LoadEditor Button
    rect: new Rect2D(327, 227, 213, 137),
    onClick: () => {
      document.removeEventListener("click", setupMenuButtons);
      levelMaker.loadEditor();
    },
  },
  {
    //Easy Button
    rect: new Rect2D(327, 375, 213, 137),
    onClick: () => {
      LevelManager.DamageModFactor = 1;
      LevelManager.LoadTimeModFactor = 1;
      ctx.drawImage(SpriteImages.selected, 441, 381);
      ctx.drawImage(SpriteImages.unselected, 441, 473);
    },
  },
  {
    //Hard Button
    rect: new Rect2D(327, 474, 213, 137),
    onClick: () => {
      LevelManager.LoadTimeModFactor = 0.7;
      LevelManager.DamageModFactor = 1.5;
      ctx.drawImage(SpriteImages.selected, 441, 473);
      ctx.drawImage(SpriteImages.unselected, 441, 381);
    },
  },
  {
    // Controls Button
    rect: new Rect2D(327, 576, 213, 137),
    onClick: () => {
      document.removeEventListener("click", setupMenuButtons);
      document.addEventListener("keydown", tryLoadMainMenu);

      ctx.drawImage(
        SpriteImages.controls,
        0,
        0,
        Globals.REF_WIDTH,
        Globals.REF_HEIGHT
      );
    },
  },
];

function setupCanvas() {
  if (canvas.parentElement) {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    // console.log(canvas.width, canvas.height, Globals.scale);
    if (canvas.width / canvas.height < Globals.REF_WIDTH / Globals.REF_HEIGHT) {
      canvas.height = canvas.width * (Globals.REF_HEIGHT / Globals.REF_WIDTH);
    } else {
      canvas.width = canvas.height * (Globals.REF_WIDTH / Globals.REF_HEIGHT);
    }
    // ctx.scale(canvas.width / REF_WIDTH, canvas.height / REF_HEIGHT);
    Globals.scale = canvas.width / Globals.REF_WIDTH;
    ctx.scale(Globals.scale, Globals.scale);

    canvas.style.backgroundImage = `url(${SpriteImages.background.src})`;
    canvas.style.backgroundSize = "3840px 2160px";
    canvas.style.backgroundPosition = "0px 0px";
  }
}

export function loadMainMenu() {
  levelMaker = new LevelMaker();
  levelManager = new LevelManager();
  LevelManager.gameState = GameState.menu;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    SpriteImages.menuBG,
    0,
    0,
    Globals.REF_WIDTH,
    Globals.REF_HEIGHT
  );
  LevelManager.DamageModFactor = 1;
  LevelManager.DamageModFactor = 1;
  ctx.drawImage(SpriteImages.selected, 441, 381);
  ctx.drawImage(SpriteImages.unselected, 441, 473);
  document.removeEventListener("click", setupMenuButtons);
  document.addEventListener("click", setupMenuButtons);
}

function setupMenuButtons(e: MouseEvent) {
  const mouseX = e.offsetX / Globals.scale;
  const mouseY = e.offsetY / Globals.scale;

  menuButtons.forEach((btn) => {
    if (
      mouseX > btn.rect.x &&
      mouseX < btn.rect.x + btn.rect.width &&
      mouseY > btn.rect.y &&
      mouseY < btn.rect.y + btn.rect.height
    ) {
      // document.removeEventListener("click", setupMenuButtons);
      btn.onClick();
    }
  });
}

function addKey(e: KeyboardEvent) {
  Globals.keysPressed.add(e.key.toLowerCase());
}
function removeKey(e: KeyboardEvent) {
  Globals.keysPressed.delete(e.key.toLowerCase());
}
function addClicked(e: MouseEvent) {
  // console.log(`Pressed ${e.button}`);
  Globals.keysPressed.add(
    e.button === 0 ? "leftM" : e.button === 2 ? "rightM" : "someM"
  );
}
function removeClicked(e: MouseEvent) {
  Globals.keysPressed.delete(
    e.button === 0 ? "leftM" : e.button === 2 ? "rightM" : "someM"
  );
}
function setupGlobalControls() {
  clearMainControls();
  window.addEventListener("keydown", addKey);
  window.addEventListener("keyup", removeKey);
  window.addEventListener("mousedown", addClicked);
  window.addEventListener("mouseup", removeClicked);
}

function clearMainControls() {
  window.removeEventListener("keydown", addKey);
  window.removeEventListener("keyup", removeKey);
  window.removeEventListener("mousedown", addClicked);
  window.removeEventListener("mouseup", removeClicked);
}

export { ctx };
