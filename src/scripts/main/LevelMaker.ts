import { SpriteImages } from "./../utils/ImageRepo";
import Plat1 from "../prefabs/Plat1";
import Constants from "../utils/constants";
import { ctx } from "./main";
import Eraser from "../entities/Eraser";
// enum Prefab {
//   Plat1 = 1,
// }
import { Rect2D, renderButton } from "../utils/utils";
import { env } from "process";
interface Button {
  text: string;
  rect: Rect2D;
  onClick: () => void;
  active: boolean;
}

let prefabArr = [null, Plat1, Plat1];
export class LevelMaker {
  rowCount = 4;
  columnCount = 4;
  grid: number[][];
  activePrefab = -1;
  offsetX = 0;
  offsetY = 0;
  //sprites defination
  envSprite: HTMLImageElement = SpriteImages.envSprite;
  eraserSprite: HTMLImageElement = SpriteImages.eraserSprite;
  prefabButtonsToSetup: any[] = [];
  menuButtonsToSetup: any[] = [];
  isPrefabMenuSetup: boolean = false;
  isMapMenuSetup: boolean = false;
  constructor() {
    this.grid = [];
    this.initializeGrid();

    // console.log(JSON.stringify(this.grid));
    this.loadGridFromJsonFile("activeFile");

    // Save the localStorage data to a file
    // this.downloadJSON("testLevel", "testLevel.json");
  }

  initializeGrid() {
    this.grid = [];
    for (let i = 0; i < this.rowCount; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.columnCount; j++) {
        this.grid[i][j] = -1;
      }
    }
  }

  addRows(count: number = 1) {
    this.rowCount += count;
    for (let i = 0; i < count; i++) {
      const newRow = [];
      for (let j = 0; j < this.columnCount; j++) {
        newRow[j] = -1;
      }
      this.grid.push(newRow);
    }
  }

  addCols(count: number = 1) {
    this.columnCount += count;
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < count; j++) {
        this.grid[i].push(-1);
      }
    }
  }

  serializeGridToFile(filename: string) {
    const json = JSON.stringify(this.grid);
    localStorage.setItem(filename, json);
  }

  loadGridFromJsonFile(filename: string) {
    const json = localStorage.getItem(filename);
    if (json) {
      const data = JSON.parse(json);
      this.rowCount = data.length;
      this.columnCount = data[0].length;
      this.grid = data;
    }
  }



  // Function to save localStorage data to a file
  downloadJSON(key: string, filename: string) {
    const json = localStorage.getItem(key);
    if (json) {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      console.log(`No data found in localStorage for key: ${key}`);
    }
  }


  DrawPrefabMenu() {
    let itemX = 15;
    let itemY = Constants.REF_HEIGHT - 50;
    Eraser.itemPreview(itemX, itemY, ctx, this.eraserSprite, 1);

    if (!this.isPrefabMenuSetup)
      this.prefabButtonsToSetup.push({
        rect: new Rect2D(itemX, itemY, 32, 32),
        scale: 1,
        prefab: Eraser,
        prefabNumber: 0,
      });
    itemX += 32 * 1 + 32;
    Plat1.itemPreview(itemX, itemY, ctx, this.envSprite, 1);
    if (!this.isPrefabMenuSetup)
      this.prefabButtonsToSetup.push({
        rect: new Rect2D(itemX, itemY, 32 * 2, 32),
        scale: 1,
        prefab: Plat1,
        prefabNumber: 1,
      });
    itemX += 32 * 2 + 32;
    Plat1.itemPreview(itemX, itemY, ctx, this.envSprite, 1);
    if (!this.isPrefabMenuSetup)
      this.prefabButtonsToSetup.push({
        rect: new Rect2D(itemX, itemY, 32 * 2, 32),
        scale: 1,
        prefab: Plat1,
        prefabNumber: 2,
      });
    itemX += 32 * 2;
    // console.log("prefacButons", this.prefabButtonsToSetup);
    this.isPrefabMenuSetup = true;
  }

  setupPrefabButtons() {
    // console.log("prefab clicked:   ", this.activePrefab, prefabNumber);
    ctx.canvas.addEventListener("click", (e) => {
      this.prefabButtonsToSetup.forEach((btn) => {
        if (
          e.offsetX / Constants.scale > btn.rect.x &&
          e.offsetX / Constants.scale < btn.rect.x + btn.rect.width &&
          e.offsetY / Constants.scale > btn.rect.y &&
          e.offsetY / Constants.scale < btn.rect.y + btn.rect.height
        ) {
          this.activePrefab = btn.prefabNumber;
          console.log("Update active Prefab:", this.activePrefab);
        }
      });

      // console.log("Prefab Button listner afte if" , this.activePrefab, prefabNumber);
    });
  }

  DrawMapMenu() {
    let itemX = Constants.REF_WIDTH - 110;
    let itemY = 96;
    // console.log("WJNAOSNDOASNDKJN D")

    const addRowButton: Button = {
      text: "Add Row",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
        this.addRows();
      },
      active: true,
    };
    renderButton(ctx, addRowButton);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(addRowButton);

    itemY += 48;
    const addColButton: Button = {
      text: "Add Column",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
        this.addCols();
      },
      active: true,
    };
    renderButton(ctx, addColButton);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(addColButton);
    itemY += 48;
    const moveLeft: Button = {
      text: "MoveLeft",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
        this.offsetX-=1;
        this.offsetX = Math.max(0, this.offsetX);
      },
      active: true,
    };
    renderButton(ctx, moveLeft);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(moveLeft);
    itemY += 48;
    const moveRight: Button = {
      text: "moveRight",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
        this.offsetX+=1;
        this.offsetX = Math.max(0, this.offsetX);
      },
      active: true,
    };
    renderButton(ctx, moveRight);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(moveRight);
    itemY += 48;
    const moveDown: Button = {
      text: "moveDown",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
        this.offsetY+=1;
        this.offsetY = Math.max(0, this.offsetY);
      },
      active: true,
    };
    renderButton(ctx, moveDown);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(moveDown);
    itemY += 48;
    const moveUp: Button = {
      text: "moveUp",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
        this.offsetY-=1;
        this.offsetY = Math.max(0, this.offsetY);
      },
      active: true,
    };
    renderButton(ctx, moveUp);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(moveUp);
    itemY += 48;
    const saveMap: Button = {
      text: "saveMap",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
       this.serializeGridToFile("activeFile");
       console.log(JSON.stringify(this.grid));
      },
      active: true,
    };
    renderButton(ctx, saveMap);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(saveMap);
    itemY += 48;
    const Download: Button = {
      text: "Download",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
       this.downloadJSON("activeFile", "activeFile.json");
       console.log(JSON.stringify(this.grid));
      },
      active: true,
    };
    renderButton(ctx, Download);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(Download);
    itemY += 48;
    const ResetMap: Button = {
      text: "ResetMap",
      rect: new Rect2D(itemX, itemY, 110, 32),
      onClick: () => {
       this.rowCount=5
       this.columnCount=5
       this.initializeGrid();
      },
      active: true,
    };
    renderButton(ctx, ResetMap);
    if (!this.isMapMenuSetup) this.menuButtonsToSetup.push(ResetMap);

    this.isMapMenuSetup = true;
  }

  setupMenuButtons() {
    // console.log("prefab clicked:   ", this.activePrefab, prefabNumber);
    ctx.canvas.addEventListener("click", (e) => {
      this.menuButtonsToSetup.forEach((btn) => {
        if (
          e.offsetX / Constants.scale > btn.rect.x &&
          e.offsetX / Constants.scale < btn.rect.x + btn.rect.width &&
          e.offsetY / Constants.scale > btn.rect.y &&
          e.offsetY / Constants.scale < btn.rect.y + btn.rect.height
        ) {
          console.log("somehtingn happended");
          btn.onClick();
        }
      });

      // console.log("Prefab Button listner afte if" , this.activePrefab, prefabNumber);
    });
  }

  loadEditor() {
    console.log("loading editor");
    document.addEventListener("click", (event) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      this.setGridValue(mouseX, mouseY);
    });

    //save menu
    document.addEventListener("keydown", (event) => {
      if (event.key === "s") {
        this.serializeGridToFile("activeFile");
        console.log(JSON.stringify(this.grid));
      }
      if (event.key === "t") {
        console.log("activePrefab: ", this.activePrefab, "grid: ", this.grid);
      }
    });
    this.DrawGrid();
    this.setupMenuButtons();
    this.setupPrefabButtons();
    this.serializeGridToFile("level.json");
  }

  DrawGrid() {
    ctx.clearRect(0, 0, Constants.REF_WIDTH, Constants.REF_HEIGHT);
    this.DrawMapMenu();
    this.DrawPrefabMenu();
    const cellSize = 16;
    const startX = 16;
    const startY = 16;
    const endX = Constants.REF_WIDTH - 128 - 16 * this.offsetX;
    const endY = Constants.REF_HEIGHT - 128 - 16 * this.offsetY;

    // Draw Boundary
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      startX,
      startY,
      16 * (this.columnCount - this.offsetX),
      16 * (this.rowCount - this.offsetY)
    );
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    //draw vertical lines
    for (
      let i = 0;
      i <= this.columnCount - this.offsetX && startX + 16 * i < endX;
      i++
    ) {
      ctx.beginPath();
      ctx.moveTo(16 + i * 16, startY);
      ctx.lineTo(16 + i * 16, Math.min(endY, 16 + 16 * (this.rowCount-this.offsetY)));
      ctx.stroke();
    }
    //draw horizontal lines
    for (
      let i = 0;
      i <= this.rowCount - this.offsetY && startX + 16 * i < endX;
      i++
    ) {
      ctx.beginPath();
      ctx.moveTo(startX, 16 + i * 16);
      ctx.lineTo(Math.min(endX, 16 + 16 * (this.columnCount-this.offsetX) ), 16 + i * 16);
      ctx.stroke();
    }

    this.populateGrid();
    requestAnimationFrame(() => this.DrawGrid());
    // two corner debug
    // ctx.fillRect(32 * 0 + 16, 32 * 0 + 16, 16, 16);
    // ctx.fillRect(31 * 16 + 16, 31 * 16 + 16, 16, 16);
  }
  populateGrid() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        if (this.grid[i][j] != -1) {
          const item = prefabArr[this.grid[i][j]];
          item?.itemPreview((j-this.offsetX) * 16 + 16, (i-this.offsetY) * 16 + 16, ctx, this.envSprite, 0.5);
        }
      }
    }
  }

  setGridValue(mouseX: number, mouseY: number) {
    const cellSize = 16;
    const startX = 16;
    const startY = 16;
    const endX = Constants.REF_WIDTH - 64;
    const endY = Constants.REF_HEIGHT - 64;
    mouseX = mouseX / Constants.scale;
    mouseY = mouseY / Constants.scale;
    // if (mouseX < endX && mouseY < endY)
    //   console.log(
    //     mouseX / 16,
    //     mouseY / 16,
    //     startX / 16,
    //     startY / 16,
    //     endX / 16,
    //     endY / 16
    //   );
    if (
      mouseX >= startX &&
      mouseX <= endX &&
      mouseY >= startY &&
      mouseY <= endY
    ) {
      const i = Math.floor((mouseX - startX) / cellSize+this.offsetX);
      const j = Math.floor((mouseY - startY) / cellSize+this.offsetY);
      if (i < this.columnCount && j < this.rowCount) {
        this.grid[j][i] = this.activePrefab;
        ctx.fillStyle = "red";
        ctx.fillRect(i * 16 + 16, j * 16 + 16, 16, 16);
      }
    }
  }

  // Add event listener to listen for mouse click
}

export default LevelMaker;
