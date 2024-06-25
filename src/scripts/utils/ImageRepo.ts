import { getImage } from "./getAssest.ts";

//menu
const menuBG = getImage("/Sprites/menu/menuBG.png");
const selected = getImage("/Sprites/menu/Selected.png");
const unselected = getImage("/Sprites/menu/Unselected.png");
const controls = getImage("/Sprites/menu/controls.png");

//Env
const envSprite = getImage("/Sprites/env/villageTileSet.png");
const woodenPlatform = getImage("/Sprites/env/oneWay.png");
const spike = getImage("/Sprites/env/spike.png");
const toxicWater = getImage("/Sprites/env/toxicWaterSheet.png");
// levelMaker
const eraserSprite = getImage("/Sprites/menu/eraser.png");

// pickable
const atkUp = getImage("/Sprites/pickables/AtkUp.png");
const healthUp = getImage("/Sprites/pickables/HealthUp.png");
const speedUp = getImage("/Sprites/pickables/SpeedUp.png");
const healthPotion = getImage("/Sprites/pickables/HealthPotion.png");
//Player
const playerIdle = getImage("/Sprites/player/idle.png");
const playerRun = getImage("/Sprites/player/run.png");
const playerJump = getImage("/Sprites/player/jump.png");
const playerFall = getImage("/Sprites/player/fall.png");
const playerAtkSword = getImage("/Sprites/player/atkSword.png");
const playerAtkBroadSword = getImage("/Sprites/player/atkBroadSword.png");
const bow = getImage("/Sprites/player/atkBow.png");
const poisoned = getImage("/Sprites/states/poisonedState.png");

//Weapons + icons
const swordIcon = getImage("/Sprites/weapons/sword/swordIcon.png");
const broadSwordIcon = getImage("/Sprites/weapons/sword/broadSwordIcon.png");
const normalArrowIcon = getImage("/Sprites/weapons/arrows/normalArrowIcon.png");

//Archer
const archerWalk = getImage("Sprites/enemies/archer/archerWalk.png");
const archerIdle = getImage("Sprites/enemies/archer/archerIdle.png");
const archerShoot = getImage("Sprites/enemies/archer/archerShoot.png");

//worm
const wormWalk = getImage("Sprites/enemies/worm/wormWalk.png");
const wormIdle = getImage("Sprites/enemies/worm/wormIdle.png");
const wormAtk = getImage("Sprites/enemies/worm/wormAtk.png");
//comboter
const comboterWalk = getImage("Sprites/enemies/comboter/comboterWalk.png");
const comboterIdle = getImage("Sprites/enemies/comboter/comboterIdle.png");
const comboterAtk = getImage("Sprites/enemies/comboter/comboterAtk.png");

export const SpriteImages: { [key: string]: HTMLImageElement } = {
  menuBG,
  selected,
  unselected,
  controls,
  envSprite,
  woodenPlatform,
  spike,
  toxicWater,
  eraserSprite,
  healthPotion,
  atkUp,
  healthUp,
  speedUp,
  playerIdle,
  playerRun,
  playerJump,
  playerFall,
  playerAtkSword,
  playerAtkBroadSword,
  poisoned,
  swordIcon,
  broadSwordIcon,
  normalArrowIcon,
  bow,
  archerWalk,
  archerIdle,
  archerShoot,
  wormWalk,
  wormIdle,
  wormAtk,
  comboterWalk,
  comboterIdle,
  comboterAtk,
};
