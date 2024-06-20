import { getImage } from "./getAssest.ts";

const envSprite = getImage("/Sprites/env/villageTileSet.png");
const eraserSprite = getImage("/Sprites/menu/eraser.png");
const playerIdle = getImage("/Sprites/player/idle.png");
const playerRun = getImage("/Sprites/player/run.png");

export const SpriteImages: { [key: string]: HTMLImageElement } = {
  envSprite,
  eraserSprite,
  playerIdle,
  playerRun,
};
