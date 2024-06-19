import Plat1 from "../prefabs/Plat1";
import Player from "../entities/Player";

const Constants = {
  MAX_DELTA: 1000/30,
  PLAYER_MOVE_SPEED_X: 0.1,
  scale: 1,
  REF_WIDTH: 1365,
  REF_HEIGHT: 768,
  prefabArr: [null, Plat1, Player],
  prefabArrSizes: [
    { w: 0, h: 0 },
    { w: 32 * 2, h: 32 },
    { w: 32, h: 32 },
  ],
};

export default Constants;
