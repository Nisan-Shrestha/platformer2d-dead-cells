import { Interface } from "readline";
import { getImage } from "./getAssest.ts";

export interface AnimInfo {
  frameCount: number;
  animationLength: number;
  frameGap: number;
}
const playerIdle: AnimInfo = {
  frameCount: 45,
  animationLength: 2200,
  frameGap: 0,
};
const playerRun: AnimInfo = {
  frameCount: 20,
  animationLength: 1000,
  frameGap: 0,
};
export const AnimInfo: { [key: string]: AnimInfo } = {
  playerIdle, playerRun
};
