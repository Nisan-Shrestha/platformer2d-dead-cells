import Globals from "../utils/constants";
import { SpriteImages } from "./../utils/ImageRepo";
import { ctx, tryLoadMainMenu } from "./main";
// enum Prefab {
//   Plat1 = 1,
// }
import RectCollider from "../components/RectCollider";
import SpriteRenderer from "../components/SpriteRenderer";
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
  rowCount: number = 0;
  columnCount: number = 0;
  grid: number[][];

  // gameObjects Arrays

  envSprite: HTMLImageElement = SpriteImages.envSprite;

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
      })
      .catch((error) => {
        console.log(`Error loading grid from ${filename}.json: ${error}`);
      });
  }

  loadLevel(
    levelName: string = "",
    loadLocal: boolean = false,
    // survival: boolean = false
  ) {
    console.log("loading level: ", levelName);
    // Reset map info
    this.rowCount = 0;
    this.columnCount = 0;
    this.grid = [];
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
        console.log("This is happening");
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
    this.envSprite = SpriteImages.envSprite;
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
      ctx.textAlign = "center"
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
      setTimeout(
        () => tryLoadMainMenu(new KeyboardEvent("keydown", { key: "Escape" })),
        2000
      );
      console.log("game over");
      // show scroe goto main menu fn
      return;
    }
    if (LevelManager.gameState == GameState.won) {
      ctx.textAlign = "center"
      ctx.font = "32px monospace";
      console.log("Won level Going to next");
      ctx.fillText("You Win!",  Globals.REF_WIDTH/2,Globals.REF_HEIGHT/2-64);
      ctx.fillText(`Your Score: ${LevelManager.Score}`,  Globals.REF_WIDTH/2,Globals.REF_HEIGHT/2-24);
      // show scroe goto next Level
      return;
    }

    ctx.clearRect(0, 0, Globals.REF_WIDTH, Globals.REF_HEIGHT);
    // frameTime = Elasped time since last frame
    let frameTime = Date.now() - this.timeStamp;
    this.timeStamp = Date.now();
    // Ensure Physics calculations are deterministic and collision check happens every MAX_DELTA
    while (frameTime > 0) {
      // console.log("delta");
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
      // console.log("welp", Pickable.AllPickables.length, Pickable.AllPickables);
      let PlayerRect = new Rect2D(
        LevelManager.player!.position.x,
        LevelManager.player!.position.y,
        LevelManager.player!.collider.width,
        LevelManager.player!.collider.height
      );
      Pickable.AllPickables.forEach((pickable) => {
        // ctx.fillRect(0, 0, 100, 100);
        SpriteRenderer.drawOffsetRect(
          ctx,
          pickable.position.x -
            pickable.RangeSize.x / 2 +
            pickable.spriteRenderer.width / 2,
          pickable.position.y -
            pickable.RangeSize.y / 2 +
            pickable.spriteRenderer.height / 2,
          pickable.RangeSize.x,
          pickable.RangeSize.y
        );
        let thisDist = Math.hypot(
          pickable.position.x - LevelManager.player!.position.x,
          pickable.position.y - LevelManager.player!.position.y
        );

        // console.log(thisDist, LevelManager.player!.closestPickable);
        // console.log("inside");
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
      // Projectile.checkPlayerProjectileEffect();
      Trap.AllTraps.forEach((trap) => {
        let tRect = new Rect2D(
          trap.position.x,
          trap.position.y,
          trap.collider.width,
          trap.collider.height
        );
        // SpriteRenderer.drawOffsetRect(
        //   ctx,
        //   trap.position.x + trap.spriteRenderer.spriteRenderingOffset.x,
        //   trap.position.y + trap.spriteRenderer.spriteRenderingOffset.y,
        //   trap.collider.width,
        //   trap.collider.height,
        //   "yellow",
        //   0.5
        // );
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

    requestAnimationFrame(() => this.Update());
  }

  handleCameraPan() {
    // !TODO: Make camera pan smoother by accouting for distance from target and player
    // console.log(
    //   "offset:",
    //   LevelManager.cameraOffsetX,
    //   "position:",
    //   LevelManager.player!.position.x
    // );
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
        0.0005;
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
    // console.log(Globals.keysPressed)
    // console.log(LevelManager.activeEnemyArr);
    LevelManager.activeEnemyArr.forEach((enemy: Enemy) => {
      enemy.render(ctx);
      // enemy.debugDrawHitbox();
    });
    Projectile.allProjectiles.forEach((projectile) => {
      projectile.render(ctx);
    });
    Projectile.checkProjectileCollisions();
    Pickable.AllPickables.forEach((pickable) => {
      pickable.render(ctx);
    });
    Trap.AllTraps.forEach((trap) => {
      trap.render(ctx);
    });

    // let p = new Pickable(
    //   "test",
    //   "This is a test description that is surely mulitple lines long.",
    //   LevelManager.player!.position,
    //   new Vect2D(32, 32),
    //   SpriteImages.envSprite
    // );
    if (LevelManager.player!.closestPickable != null) {
      LevelManager.player!.closestPickable.renderDescription(ctx);
    }

    // // Player Buffs
    // if (LevelManager.player!.damageMult != 1) {
    // }
    // // Player Buffs
    // if (LevelManager.player!.speedMult != 1) {
    // }
    // Player Buffs
    LevelManager.player?.render(ctx);

    // p.renderDescription(ctx)
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
              continue;
            }
            // LevelManager.envElementArr.push(a);
          }
        }
      }
    }
    // let a = new Archer(new Vect2D(400, 64));
    // LevelManager.activeEnemyArr.push(a);
    // let b = new Worm(new Vect2D(400, 64));
    // LevelManager.activeEnemyArr.push(b);
    // let c = new Comboter(new Vect2D(500, 64));
    // LevelManager.activeEnemyArr.push(c);
    // let d = new HealthPotion(new Vect2D(120, 8 * 32));
    // let e = new HealthPotion(new Vect2D(220, 8 * 32));
    // let f = new Spike(new Vect2D(6 * 32, 9 * 32));
    // let g = new Spike(new Vect2D(7 * 32, 9 * 32));
    // let h = new ToxicWater(new Vect2D(4 * 32, 9 * 32));
    // let i = new ToxicWater(new Vect2D(5 * 32, 9 * 32));
    // let j = new SwordPicker(new Vect2D(3 * 32, 9 * 32));
    if (LevelManager.player == null) {
      LevelManager.player = new Player(new Vect2D(32 * 3, 32 * 3));
    }
    // this.setupControls();
    this.timeStamp = Date.now();
    this.Update();
  }

  // addKey(e: KeyboardEvent) {
  //   this.keysPressed.add(e.key);
  // }
  // removeKey(e: KeyboardEvent) {
  //   this.keysPressed.delete(e.key);
  // }
  // setupControls() {
  //   window.addEventListener("keydown", (e) => this.addKey(e));
  //   window.addEventListener("keyup", (e) => this.removeKey(e));
  // }
}

export default LevelManager;
