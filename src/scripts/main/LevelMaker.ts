import Globals from "../utils/constants";
import { SpriteImages } from "./../utils/ImageRepo";
import { ctx, tryLoadMainMenu } from "./main";
// enum Prefab {
//   Plat1 = 1,
// }
import Player from "../entities/Player";
import { GameState, IMenuButton, Rect2D, renderButton } from "../utils/utils";
import LevelManager from "./LevelManager";
// console.log(this)

const mapButtonConfigs: {
  text: string;
  onClick: (thisRef: LevelMaker) => void;
}[] = [
  { text: "Add Row", onClick: (thisRef) => thisRef.addRows() },
  { text: "Add Column", onClick: (thisRef) => thisRef.addCols() },
  {
    text: "Move Left",
    onClick: (thisRef) => {
      thisRef.offsetX = Math.max(0, thisRef.offsetX - 1);
    },
  },
  {
    text: "Move Right",
    onClick: (thisRef) => {
      thisRef.offsetX = Math.max(0, thisRef.offsetX + 1);
    },
  },
  {
    text: "Move Down",
    onClick: (thisRef) => {
      thisRef.offsetY = Math.max(0, thisRef.offsetY + 1);
    },
  },
  {
    text: "Move Up",
    onClick: (thisRef) => {
      thisRef.offsetY = Math.max(0, thisRef.offsetY - 1);
    },
  },
  {
    text: "Save Map",
    onClick: (thisRef) => {
      thisRef.serializeGridToFile("customLevel");
      // console.log(JSON.stringify(thisRef.grid));
    },
  },
  {
    text: "Download",
    onClick: (thisRef) => {
      thisRef.downloadJSON("customLevel", "customLevel.json");
      // console.log(JSON.stringify(thisRef.grid));
    },
  },
  {
    text: "Reset Map",
    onClick: (thisRef) => {
      thisRef.rowCount = 24;
      thisRef.columnCount = 43;
      thisRef.initializeGrid();
    },
  },
  {
    text: "Play",
    onClick: (context) => {
      context.serializeGridToFile("customLevel");
      // console.log("Map saved locally");
      new LevelManager().loadLevel("", true);
    },
  },
];

export class LevelMaker {
  rowCount = 24;
  columnCount = 43;
  grid: number[][];
  activePrefab: number = -1;
  offsetX: number = 0;
  offsetY: number = 0;
  playerPresent: boolean = false;
  //sprites defination
  envSprite: HTMLImageElement = SpriteImages.envSprite;
  eraserSprite: HTMLImageElement = SpriteImages.eraserSprite;
  prefabButtonsToSetup: IMenuButton[] = [];
  menuButtonsToSetup: IMenuButton[] = [];

  isPrefabMenuSetup: boolean = false;
  isMapMenuSetup: boolean = false;

  prefabConfigs: {
    prefab: any;
    prefabNumber: number;
    width: number;
    height: number;
    defaultSprite: HTMLImageElement;
  }[] = [
    ...Globals.prefabArr.map((prefab, index) => ({
      prefab,
      prefabNumber: index == 0 ? -1 : index,
      width: Globals.prefabArr[index]!.WIDTH,
      height: Globals.prefabArr[index]!.HEIGHT,
      defaultSprite: Globals.prefabArr[index]!.defaultSprite,
    })),
  ];
  //listeners

  constructor() {
    // console.log(this.prefabConfigs);
    this.grid = [];
    this.initializeGrid();
    this.loadGridFromJsonFile("customLevel");

    // console.log(JSON.stringify(this.grid));

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
      // console.log(`No data found in localStorage for key: ${key}`);
    }
  }

  setupPrefabButtons() {
    let itemX = 10;
    let itemY = Globals.REF_HEIGHT - 32 * 4;

    let dx = 0;
    this.prefabConfigs.forEach((config) => {
      let dy = 0;
      let resetY = false;
      if (itemY + config.height > Globals.REF_HEIGHT - 64) {
        resetY = true;
        dy = 0;
      } else {
        dy = config.height + 16;
      }

      dx = Math.max(config.width + 16, dx); // Adjust the spacing as needed
      // itemX += config.width + 32; // Adjust the spacing as needed
      const btnConfig: IMenuButton = {
        rect: new Rect2D(itemX, itemY, config.width, config.height),
        onClick: () => {
          this.activePrefab = config.prefabNumber;
          // console.log("Update active Prefab:", this.activePrefab);
        },
        active: true,
        prefab: config.prefab,
        prefabNumber: config.prefabNumber,
        defaultSprite: config.defaultSprite,
      };
      this.prefabButtonsToSetup.push(btnConfig);
      if (resetY) {
        itemY = Globals.REF_HEIGHT - 32 * 4;
        itemX += dx;
        dx = 0;
      } else {
        itemY += dy;
      }
    });

    document.addEventListener("click", this.prefabMenuClickListener);
  }

  prefabMenuClickListener = (e: MouseEvent) => {
    this.prefabButtonsToSetup.forEach((btn) => {
      if (
        e.offsetX / Globals.scale > btn.rect.x &&
        e.offsetX / Globals.scale < btn.rect.x + btn.rect.width &&
        e.offsetY / Globals.scale > btn.rect.y &&
        e.offsetY / Globals.scale < btn.rect.y + btn.rect.height
      ) {
        btn.onClick();
      }
    });
  };

  DrawPrefabMenu() {
    this.prefabButtonsToSetup.forEach((btn) => {
      btn.prefab?.itemPreview(
        btn.rect.x,
        btn.rect.y,
        ctx,
        btn.defaultSprite,
        1
      );
    });
  }

  DrawMapMenu() {
    ctx.textAlign = "left";
    ctx.font = "32px monospace";
    this.menuButtonsToSetup.forEach((btn) => {
      renderButton(ctx, btn);
    });
  }
  setupMenuButtons() {
    let itemX = Globals.REF_WIDTH - 118;
    let itemY = 96;

    mapButtonConfigs.forEach((button) => {
      const btnConfig: IMenuButton = {
        text: button.text,
        rect: new Rect2D(itemX, itemY, 110, 32),
        onClick: () => button.onClick(this),
        active: true,
      };
      this.menuButtonsToSetup.push(btnConfig);
      itemY += 48;
    });

    document.addEventListener("click", this.mapMenuClickListener);
  }
  mapMenuClickListener = (e: MouseEvent) => {
    this.menuButtonsToSetup.forEach((btn) => {
      if (
        e.offsetX / Globals.scale > btn.rect.x &&
        e.offsetX / Globals.scale < btn.rect.x + btn.rect.width &&
        e.offsetY / Globals.scale > btn.rect.y &&
        e.offsetY / Globals.scale < btn.rect.y + btn.rect.height
      ) {
        btn.onClick();
      }
    });
  };

  loadEditor() {
    LevelManager.gameState = GameState.editor;
    // console.log("loading editor");
    this.grid = [];
    this.initializeGrid();
    this.loadGridFromJsonFile("customLevel");

    document.addEventListener("mousemove", this.setupGridPlacerOnMove);
    document.addEventListener("mousedown", this.setupGridPlacerOnClick);

    //save menu

    this.DrawGrid();
    this.setupMenuButtons();
    this.setupPrefabButtons();
    this.serializeGridToFile("level.json");
    document.removeEventListener("keydown", tryLoadMainMenu);
    document.addEventListener("keydown", tryLoadMainMenu);
  }

  setupGridPlacerOnMove = (event: MouseEvent) => {
    // console.log("Globals.keysPressed:", Globals.keysPressed);
    if (Globals.keysPressed.has("leftM")) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      this.setGridValue(mouseX, mouseY);
    } else if (Globals.keysPressed.has("rightM")) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      this.setGridValue(mouseX, mouseY, true);
    }
  };

  setupGridPlacerOnClick = (event: MouseEvent) => {
    // console.log("current button:", event.button);
    if (event.button === 0) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      this.setGridValue(mouseX, mouseY);
    } else if (event.button === 2) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      this.setGridValue(mouseX, mouseY, true);
    }
  };

  DrawGrid() {
    if (LevelManager.gameState != GameState.editor) {
      document.removeEventListener("click", this.mapMenuClickListener);
      document.removeEventListener("click", this.prefabMenuClickListener);
      document.removeEventListener("mousemove", this.setupGridPlacerOnMove);
      document.removeEventListener("mousedown", this.setupGridPlacerOnClick);
      return;
    }
    ctx.clearRect(0, 0, Globals.REF_WIDTH, Globals.REF_HEIGHT);
    

    const cellSize = 16;
    const startX = 16;
    const startY = 16;
    const endX = Globals.REF_WIDTH - 154;
    const endY = Globals.REF_HEIGHT - 154;
    const columnCount = this.columnCount - this.offsetX;
    const rowCount = this.rowCount - this.offsetY;

    // Draw Boundary
    ctx.strokeStyle = "red";
    ctx.strokeRect(startX, startY, cellSize * columnCount, cellSize * rowCount);
    ctx.globalAlpha=.3;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    ctx.beginPath();
    for (let i = 0; i <= columnCount && startX + cellSize * i < endX; i++) {
      ctx.moveTo(startX + cellSize * i, startY);
      ctx.lineTo(
        startX + cellSize * i,
        Math.min(endY, startY + cellSize * rowCount)
      );
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= rowCount && startY + cellSize * i < endY; i++) {
      ctx.moveTo(startX, startY + cellSize * i);
      // console.log(endX, startX + cellSize * columnCount);
      ctx.lineTo(
        Math.min(endX, startX + cellSize * columnCount),
        startY + cellSize * i
      );
    }
    ctx.stroke();
    ctx.globalAlpha=1;
    
    this.populateGrid();
    this.DrawMapMenu();
    this.DrawPrefabMenu();
    requestAnimationFrame(() => this.DrawGrid());
  }
  populateGrid() {
    this.playerPresent = false;
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        if (this.grid[i][j] != -1) {
          const item = Globals.prefabArr[this.grid[i][j]];
          if (item == Player && !this.playerPresent) {
            this.playerPresent = true;
          } else if (item == Player && this.playerPresent) {
            this.grid[i][j] = -1;
            continue;
          }
          item?.itemPreview(
            (j - this.offsetX) * 16 + 16,
            (i - this.offsetY) * 16 + 16,
            ctx,
            item.defaultSprite,
            0.5
          );
        }
      }
    }
  }

  setGridValue(mouseX: number, mouseY: number, eraseMode: boolean = false) {
    const cellSize = 16;
    const startX = 16;
    const startY = 16;
    const endX = Globals.REF_WIDTH - 154;
    const endY = Globals.REF_HEIGHT - 154;
    mouseX = mouseX / Globals.scale;
    mouseY = mouseY / Globals.scale;

    if (
      mouseX >= startX &&
      mouseX <= endX &&
      mouseY >= startY &&
      mouseY <= endY
    ) {
      const i = Math.floor((mouseX - startX) / cellSize + this.offsetX);
      const j = Math.floor((mouseY - startY) / cellSize + this.offsetY);
      if (i > this.columnCount || j > this.rowCount) {
        return;
      }
      if (eraseMode) {
        if (this.grid[j][i] === Globals.prefabArr.indexOf(Player)) {
          this.playerPresent = false;
        }
        this.grid[j][i] = -1;
        return;
      }
      if (Globals.prefabArr[this.activePrefab] != Player) {
        if (this.grid[j][i] === Globals.prefabArr.indexOf(Player)) {
          this.playerPresent = false;
        }
        this.grid[j][i] = this.activePrefab;
        ctx.fillStyle = "red";
        ctx.fillRect(i * 16 + 16, j * 16 + 16, 16, 16);
      } else if (
        Globals.prefabArr[this.activePrefab] == Player &&
        !this.playerPresent
      ) {
        this.grid[j][i] = this.activePrefab;
        ctx.fillStyle = "red";
        ctx.fillRect(i * 16 + 16, j * 16 + 16, 16, 16);
        this.playerPresent = true;
      }
    }
  }

  // Add event listener to listen for mouse click
}

export default LevelMaker;
