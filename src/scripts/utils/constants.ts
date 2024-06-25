import Player from "../entities/Player";
import Archer from "../prefabs/Enemy/Archer";
import Comboter from "../prefabs/Enemy/Comboter";
import Worm from "../prefabs/Enemy/Worm";
import NormalArrow from "../prefabs/Weapons/NormalArrow";
import SwordPicker from "../prefabs/weaponPicks/SwordPicker";
import BroadSwordPicker from "../prefabs/weaponPicks/BroadSwordPicker";
import OneWayPlat1x1 from "../prefabs/Platforms/OneWayPlat1x1";
import OneWayPlat3x1 from "../prefabs/Platforms/OneWayPlat3x1";
import Plat1x1Filler from "../prefabs/Platforms/Plat1x1Filler";
import Plat1x3 from "../prefabs/Platforms/Plat1x3";
import Plat2x1 from "../prefabs/Platforms/Plat2x1";
import Plat3x1 from "../prefabs/Platforms/Plat3x1";
import Plat3x3 from "../prefabs/Platforms/Plat3x3";
import HealthPotion from "../prefabs/pickable/HealthPotion";
import Spike from "../prefabs/Traps/Spike";
import ToxicWater from "../prefabs/Traps/ToxicWater";
import Eraser from "../entities/Eraser";
import HealthUp from "../prefabs/pickable/HealthUp";
import SpeedUp from "../prefabs/pickable/SpeedUp";
import AtkUp from "../prefabs/pickable/AtkUp";
// let level1 = import("../../levels/Level1.json");
// let level2 = import("../../levels/Level2.json");
// let level3 = import("../../levels/Level3.json");
// let survival = import("../../levels/Survival.json");
// export const;
const Globals = {
  // Levels : [level1, level2, level3, survival],
  keysPressed: new Set<string>(),
  MAX_DELTA: 1000 / 30,
  PLAYER_MOVE_SPEED_X: 0.125,
  PLAYER_DRAG_X: 0.2,
  PLAYER_JUMP_POWER: 0.45,
  GRAVITY: 1 / 1000,
  scale: 1,
  REF_WIDTH: 1365,
  REF_HEIGHT: 768,
  prefabArr: [
    Eraser,
    Player,
    OneWayPlat1x1,
    OneWayPlat3x1,
    Plat1x1Filler,
    Plat1x3,
    Plat2x1,
    Plat3x1,
    Plat3x3,
    Archer,
    Comboter,
    Worm,
    HealthPotion,
    Spike,
    ToxicWater,
    BroadSwordPicker,
    SwordPicker,
    HealthUp,
    SpeedUp,
    AtkUp,
  ],
  enemiesArr: [Archer, Comboter, Worm],
  enemiesSpawnIndex: [
    [6, 6],
    [19, 12],
    [40, 6],
    [15, 20],
    [28, 20],
  ],
  enemyDropArr: [HealthPotion, HealthUp, SpeedUp, AtkUp],
  playerProjectileArr: [NormalArrow],
  weaponPickerMap: {
    sword: SwordPicker,
    broadSword: BroadSwordPicker,
  },
};

export default Globals;
