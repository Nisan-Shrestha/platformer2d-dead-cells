import Globals from "../utils/constants";
import { ctx, loadMainMenu, tryLoadMainMenu } from "./main";
// enum Prefab {
//   Plat1 = 1,
// }
import RectCollider from "../components/RectCollider";
import Projectile from "../components/WeaponBase/Projectile";
import Enemy from "../entities/Enemy";
import Pickable from "../entities/Pickable";
import Player from "../entities/Player";
import Trap from "../entities/Traps";
import { AABBIntersect, GameState, Rect2D, Vect2D } from "../utils/utils";
// import { keysPressed } from "./main";

export class LevelManager {
  static LoadTimeModFactor: number = 1;
  static DamageModFactor: number = 1;
  // Camera/Offset Vars
  static cameraOffsetX: number = 0;
  static cameraOffsetY: number = 0;
  static Score: number = 0;
  static gameState: GameState = GameState.playing;
  static player: Player | null = null;
  static activeEnemyArr: Enemy[] = [];
  static envElementArr: any = [];
  // Map Info
  currentLevel: string = "";
  rowCount: number = 0;
  columnCount: number = 0;
  grid: number[][];

  //Survival mode counters
  maxEnemies: number = 8;
  survivalMode: boolean = false;

  // Level States
  timeStamp: number = Date.now();
  levelLoadPending: boolean = true;
  constructor() {
    LevelManager.gameState = GameState.playing;
    this.grid = [];
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
      });
  }

  loadLevel(
    levelName: string = "",
    loadLocal: boolean = false,
    survivalMode: boolean = false
  ) {
    if (survivalMode) {
      this.survivalMode = survivalMode;
      this.maxEnemies = 8;
    }
    // console.log("loading level: ", levelName);
    // Reset map info
    this.rowCount = 0;
    this.columnCount = 0;
    this.grid = [];
    this.currentLevel = levelName;
    LevelManager.cameraOffsetX = 32;
    LevelManager.cameraOffsetY = 16;

    if (levelName === "" || loadLocal == true) {
      this.loadGridFromJsonFile("customLevel");
    } else {
      this.loadGridFromPublicFolder(levelName);
    }
    //debugger
    // document.addEventListener("keydown", (event) => {
    //   if (event.key === "p") {
    //     console.log(JSON.stringify(this.grid));
    //   }
    // });
    document.addEventListener("keydown", (event) => {
      if (event.key === "q") {
        // console.log("This is happening");
      }
    });
    document.removeEventListener("keydown", tryLoadMainMenu);
    document.addEventListener("keydown", tryLoadMainMenu);

    this.waitTillLoad();
  }

  // doesnt reset grid, rowCount, columnCount
  resetLevelParams() {
    LevelManager.LoadTimeModFactor = 1;
    LevelManager.DamageModFactor = 1;
    // Camera/Offset Vars
    LevelManager.cameraOffsetX = 0;
    LevelManager.cameraOffsetY = 0;
    LevelManager.Score = 0;
    LevelManager.envElementArr = [];
    LevelManager.activeEnemyArr = [];
    LevelManager.gameState = GameState.playing;
    RectCollider.clearAll();
    Projectile.allProjectiles = [];
    Pickable.AllPickables = [];
    Trap.AllTraps = [];

    Globals.keysPressed = new Set<string>();
    this.timeStamp = Date.now();
    this.levelLoadPending = true;
    LevelManager.player = null;
  }

  waitTillLoad() {
    if (this.levelLoadPending) {
      setTimeout(() => {
        this.waitTillLoad();
      }, 100);
      return;
    } else {
      this.resetLevelParams();
      this.populateUsingGrid();
      // console.log((RectCollider.colliderArray[0].parentObj) instanceof Plat1);
    }
  }

  Update() {
    // console.log(LevelManager.gameState);
    if (LevelManager.gameState == GameState.menu) return;
    if (LevelManager.gameState == GameState.lost) {
      ctx.textAlign = "center";
      ctx.font = "32px monospace";
      ctx.fillText(
        "You Lost!",
        Globals.REF_WIDTH / 2,
        Globals.REF_HEIGHT / 2 - 64
      );
      ctx.fillText(
        `Your Score: ${LevelManager.Score}`,
        Globals.REF_WIDTH / 2,
        Globals.REF_HEIGHT / 2 - 24
      );
      setTimeout(() => loadMainMenu(), 2000);
      // console.log("game over");
      // show scroe goto main menu fn
      return;
    }
    if (LevelManager.gameState == GameState.won) {
      ctx.textAlign = "center";
      ctx.font = "32px monospace";
      // console.log("Won level Going to next");
      ctx.fillText(
        `Cleared Level: ${this.currentLevel}!, Loading Next Screen`,
        Globals.REF_WIDTH / 2,
        Globals.REF_HEIGHT / 2 - 64
      );
      ctx.fillText(
        `Your Score: ${LevelManager.Score}`,
        Globals.REF_WIDTH / 2,
        Globals.REF_HEIGHT / 2 - 24
      );
      if (this.currentLevel == "Level1") {
        setTimeout(() => {
          this.loadLevel("Level2");
        }, 2000);
      } else if (this.currentLevel == "Level2") {
        setTimeout(() => {
          this.loadLevel("Level3");
        }, 2000);
      } else {
        setTimeout(() => loadMainMenu(), 2000);
      }
      // show scroe goto next Level
      return;
    }
    if (this.survivalMode) {
      this.maxEnemies = 8 + Math.floor(LevelManager.Score / 50);
      if (LevelManager.activeEnemyArr.length < this.maxEnemies) {
        let posIndex =
        Globals.enemiesSpawnIndex[
          Math.floor(Math.random() * Globals.enemiesSpawnIndex.length)
        ];
        let enemyType =
        Globals.enemiesArr[
          Math.floor(Math.random() * Globals.enemiesArr.length)
        ];

        new enemyType(new Vect2D(posIndex[0] * 32, posIndex[1] * 32))
      }
    }

    ctx.clearRect(0, 0, Globals.REF_WIDTH, Globals.REF_HEIGHT);
    // frameTime = Elasped time since last frame
    let frameTime = Date.now() - this.timeStamp;
    this.timeStamp = Date.now();
    // Ensure Physics calculations are deterministic and collision check happens every MAX_DELTA
    // console.log("frameTime: ", frameTime);
    while (frameTime > 0) {
      // Update remaining time for calc this frame
      let deltaTime = Math.min(frameTime, Globals.MAX_DELTA);
      frameTime -= Globals.MAX_DELTA;
      Trap.AllTraps.forEach((element) => {
        element.update(deltaTime);
      });

      LevelManager.player?.update(deltaTime);
      LevelManager.activeEnemyArr.forEach((enemy) => {
        enemy.update(deltaTime);
      });
      Projectile.allProjectiles.forEach((projectile) => {
        projectile.update(deltaTime);
      });
      let dist = 5000;
      LevelManager.player!.closestPickable = null;
      let PlayerRect = new Rect2D(
        LevelManager.player!.position.x,
        LevelManager.player!.position.y,
        LevelManager.player!.collider.width,
        LevelManager.player!.collider.height
      );
      Pickable.AllPickables.forEach((pickable) => {
        let thisDist = Math.hypot(
          pickable.position.x - LevelManager.player!.position.x,
          pickable.position.y - LevelManager.player!.position.y
        );

        if (
          thisDist <= dist &&
          AABBIntersect(
            new Rect2D(
              pickable.position.x - pickable.RangeSize.x / 2,
              pickable.position.y - pickable.RangeSize.y / 2,
              pickable.RangeSize.x,
              pickable.RangeSize.y
            ),
            PlayerRect
          )
        ) {
          dist = thisDist;
          LevelManager.player!.closestPickable = pickable;
        }
      });
      Trap.AllTraps.forEach((trap) => {
        let tRect = new Rect2D(
          trap.position.x,
          trap.position.y,
          trap.collider.width,
          trap.collider.height
        );

        if (AABBIntersect(tRect, PlayerRect)) {
          trap.OnHit();
        } else {
          trap.setActive(true);
        }
      });
    }
    // Camera Pan Logic
    this.handleCameraPan();

    // Render all game objects: environment, enemies, player, projectiles
    this.render();
    if (LevelManager.activeEnemyArr.length == 0) {
      LevelManager.gameState = GameState.won;
    }
    if (LevelManager.player!.healthBar.value <= 0) {
      LevelManager.gameState = GameState.lost;
    }
    // canvas.style.backgroundSize = "3840px 2160px";
    let xpos =
      -LevelManager.cameraOffsetX /
      ((this.columnCount * 32) / Globals.REF_WIDTH);
    let ypos =
      -LevelManager.cameraOffsetY / ((this.rowCount * 32) / Globals.REF_HEIGHT);
    // console.log("LevelManager.cameraO:", LevelManager.cameraOffsetX, xpos);
    ctx.canvas.style.backgroundPosition = `${xpos}px ${ypos}px`;
    requestAnimationFrame(() => this.Update());
  }

  handleCameraPan() {
    if (
      LevelManager.player!.position.x >
      LevelManager.cameraOffsetX + (Globals.REF_WIDTH * 3) / 4
    ) {
      LevelManager.cameraOffsetX +=
        (LevelManager.player!.position.x -
          LevelManager.cameraOffsetX +
          (Globals.REF_WIDTH * 3) / 4) *
        0.0005;
    } else if (
      LevelManager.player!.position.x <
      LevelManager.cameraOffsetX + (Globals.REF_WIDTH * 1) / 4
    ) {
      LevelManager.cameraOffsetX -=
        (LevelManager.player!.position.x -
          LevelManager.cameraOffsetX +
          (Globals.REF_WIDTH * 1) / 4) *
        0.001;
    }
    if (
      LevelManager.player!.position.y >
      LevelManager.cameraOffsetY + (Globals.REF_HEIGHT * 7) / 10
    ) {
      LevelManager.cameraOffsetY += 1;
    } else if (
      LevelManager.player!.position.y <
      LevelManager.cameraOffsetY + (Globals.REF_HEIGHT * 4) / 10
    ) {
      LevelManager.cameraOffsetY -= 1;
    }
  }

  render() {
    // Render EVERYTHING

    LevelManager.envElementArr.forEach((obj: any) => {
      obj.render(ctx);
    });
    LevelManager.activeEnemyArr.forEach((enemy: Enemy) => {
      enemy.render(ctx);
    });
    Projectile.allProjectiles.forEach((projectile) => {
      projectile.render(ctx);
    });
    Projectile.checkProjectileCollisions();
    Pickable.AllPickables.forEach((pickable) => {
      pickable.render(ctx);
    });
    if (LevelManager.player!.closestPickable != null) {
      LevelManager.player!.closestPickable.renderDescription(ctx);
    }
    LevelManager.player?.render(ctx);
    Trap.AllTraps.forEach((trap) => {
      trap.render(ctx);
    });
  }

  populateUsingGrid() {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        if (this.grid[i][j] > 0) {
          const item = Globals.prefabArr[this.grid[i][j]];
          let a;
          if (item != null) {
            a = new item(new Vect2D(j * 32, i * 32));
            if (a instanceof Player) {
              LevelManager.player = a;
              LevelManager.player.position = new Vect2D(j * 32, i * 32);
              continue;
            }
          }
        }
      }
    }

    if (LevelManager.player == null) {
      LevelManager.player = new Player(new Vect2D(32 * 3, 32 * 3));
    }
    // this.setupControls();
    this.timeStamp = Date.now();
    if (this.survivalMode) {
      LevelManager.activeEnemyArr = [];
    }
    // LevelManager.activeEnemyArr=[]
    this.Update();
  }
}

export default LevelManager;
