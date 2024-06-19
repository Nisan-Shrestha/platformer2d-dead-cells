import { SpriteImages } from "./../utils/ImageRepo";
import Plat1 from "../prefabs/Plat1";
import Constants from "../utils/constants";
import { ctx } from "./main";
import Eraser from "../entities/Eraser";
// enum Prefab {
//   Plat1 = 1,
// }
import { AABBIntersect, Rect2D, renderButton, Vect2D } from "../utils/utils";
import { it } from "node:test";
import Player from "../entities/Player";
import RectCollider from "../components/RectCollider";
import { platform } from "process";

export class LevelManager {
  rowCount: number = 0;
  columnCount: number = 0;
  grid: number[][];
  offsetX: number = 0;
  offsetY: number = 0;
  objArr: any = [];
  envSprite: HTMLImageElement = SpriteImages.envSprite;
  eraserSprite: HTMLImageElement = SpriteImages.eraserSprite;
  keysPressed: Set<string> = new Set<string>();
  player: Player | null = null;
  timeStamp: number = Date.now();
  levelLoadPending: boolean = true;
  constructor(levelFilePath: string = "", loadLocal: boolean = false) {
    this.grid = [];
    this.loadLevel(levelFilePath, loadLocal);
  }

  loadGridFromJsonFile(filename: string) {
    this.levelLoadPending = true;
    const json = localStorage.getItem(filename);
    if (json) {
      const data = JSON.parse(json);
      this.rowCount = data.length;
      this.columnCount = data[0].length;
      this.grid = data;
      this.levelLoadPending = false;
    }
  }

  loadGridFromPublicFolder(filename: string) {
    // console.log("here")
    this.levelLoadPending = true;
    fetch(`/levels/${filename}.json`)
      .then((response) => response.json())
      .then((data) => {
        this.rowCount = data.length;
        this.columnCount = data[0].length;
        this.grid = data;

        this.levelLoadPending = false;
        // console.log(this.grid)
      })
      .catch((error) => {
        console.log(`Error loading grid from ${filename}.json: ${error}`);
      });
  }

  loadLevel(levelFilePath: string = "", loadLocal: boolean = false) {
    console.log("loading level: ", levelFilePath);
    this.rowCount = 0;
    this.columnCount = 0;
    this.grid = [];
    this.offsetX = 0;
    this.offsetY = 0;

    if (levelFilePath === "" || loadLocal == true) {
      this.loadGridFromJsonFile("activeFile");
    } else {
      this.loadGridFromPublicFolder(levelFilePath);
    }
    //debugger
    document.addEventListener("keydown", (event) => {
      if (event.key === "p") {
        console.log(JSON.stringify(this.grid));
      }
    });

    this.waitTillLoad();
  }

  // doesnt reset grid, rowCount, columnCount
  resetLevelParams() {
    this.objArr = [];
    this.envSprite = SpriteImages.envSprite;
    this.eraserSprite = SpriteImages.eraserSprite;
    this.keysPressed = new Set<string>();
    this.player = null;
    this.timeStamp = Date.now();
    this.levelLoadPending = true;
    RectCollider.clearAll();
  }

  waitTillLoad() {
    if (this.levelLoadPending) {
      setTimeout(() => {
        this.waitTillLoad();
      }, 100);
      return;
    } else {
      this.resetLevelParams();
      this.populateGrid();
      // console.log((RectCollider.colliderArray[0].parentObj) instanceof Plat1);
    }
  }

  Update() {
    let frameTime = Date.now() - this.timeStamp;
    this.timeStamp = Date.now();
    // Ensure Physics calculations are deterministic
    while (frameTime > 0) {
      let deltaTime = Math.min(frameTime, Constants.MAX_DELTA);
      ctx.clearRect(0, 0, Constants.REF_WIDTH, Constants.REF_HEIGHT);
      this.player?.update(deltaTime);

      frameTime -= Constants.MAX_DELTA;
    }
    this.player?.render(ctx);
    this.objArr.forEach((obj: any) => {
      obj.render(ctx);
    });
    // RectCollider.colliderArray.forEach((collider) => {collider.debugDraw(ctx);})
    // console.log(this.player?.position)
    requestAnimationFrame(() => this.Update());
  }

  populateGrid() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        if (this.grid[i][j] > 0) {
          const item = Constants.prefabArr[this.grid[i][j]];
          let a;
          if (item != null) {
            a = new item(new Vect2D(j * 32, i * 32), this.envSprite);
            if (a instanceof Player) {
              this.player = a;
              continue;
            }
            this.objArr.push(a);
          }
        }
      }
    }
    this.player?.assignKeySet(this.keysPressed);
    this.setupControls();
    this.timeStamp = Date.now();
    this.Update();
  }

  addKey(e: KeyboardEvent) {
    this.keysPressed.add(e.key);
  }
  removeKey(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);
  }
  setupControls() {
    window.addEventListener("keydown", (e) => this.addKey(e));
    window.addEventListener("keyup", (e) => this.removeKey(e));
  }
}

export default LevelManager;
