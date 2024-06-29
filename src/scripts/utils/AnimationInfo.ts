
export interface IAnimInfo {
  frameCount: number;
  animationLength: number;
  frameGap: number;
}

const playerIdle: IAnimInfo = {
  frameCount: 45,
  animationLength: 2200,
  frameGap: 0,
};
const playerRun: IAnimInfo = {
  frameCount: 20,
  animationLength: 600,
  frameGap: 0,
};
const playerJump: IAnimInfo = {
  frameCount: 6,
  animationLength: 600,
  frameGap: 0,
};
const playerFall: IAnimInfo = {
  frameCount: 5,
  animationLength: 200,
  frameGap: 0,
};
const playerAtkSword: IAnimInfo = {
  frameCount: 13,
  animationLength: 2000,
  frameGap: 0,
};
const playerAtkBroadSword: IAnimInfo = {
  frameCount: 28,
  animationLength: 1200,
  frameGap: 0,
};
const bow: IAnimInfo = {
  frameCount: 28,
  animationLength: 600,
  frameGap: 0,
};
const comboterIdle: IAnimInfo = {
  frameCount: 33,
  animationLength: 2500,
  frameGap: 0,
};
const comboterAtk: IAnimInfo = {
  frameCount: 24,
  animationLength: 2000,
  frameGap: 0,
};
const comboterWalk: IAnimInfo = {
  frameCount: 20,
  animationLength: 2000,
  frameGap: 0,
};
const wormIdle: IAnimInfo = {
  frameCount: 30,
  animationLength: 2500,
  frameGap: 0,
};
const wormAtk: IAnimInfo = {
  frameCount: 3,
  animationLength: 800,
  frameGap: 0,
};
const wormWalk: IAnimInfo = {
  frameCount: 20,
  animationLength: 2000,
  frameGap: 0,
};
const archerIdle: IAnimInfo = {
  frameCount: 46,
  animationLength: 3800,
  frameGap: 0,
};
const archerShoot: IAnimInfo = {
  frameCount: 22,
  animationLength: 1800,
  frameGap: 0,
};
const archerWalk: IAnimInfo = {
  frameCount: 29,
  animationLength: 1600,
  frameGap: 0,
};

const toxicWater: IAnimInfo = {
  frameCount: 4,
  animationLength: 500,
  frameGap: 0,
};

// for animations that have only one frame
const base: IAnimInfo = {
  frameCount: 1,
  animationLength: 1000,
  frameGap: 0,
};
export const AnimInfo: { [key: string]: IAnimInfo } = {
  base,
  bow,
  playerIdle,
  playerRun,
  playerJump,
  playerFall,
  playerAtkSword,
  playerAtkBroadSword,
  comboterIdle,
  comboterWalk,
  comboterAtk,
  wormIdle,
  wormWalk,
  wormAtk,
  archerIdle,
  archerWalk,
  archerShoot,
  toxicWater,
};
