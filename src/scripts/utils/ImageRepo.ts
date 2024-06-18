import { getImage } from "./getAssest.ts";

const envSprite = getImage("/Sprites/env/villageTileSet.png");
const eraserSprite = getImage("/Sprites/menu/eraser.png");


export const SpriteImages:{[key:string]: HTMLImageElement} = {
  envSprite,
  eraserSprite
};