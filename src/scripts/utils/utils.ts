export enum GameState {
  "won",
  "lost",
  "playing",
  "menu",
  "editor",
}
export class Rect2D {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string = "purple";
  // image: Image
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = "purple"
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
  }
}

export class Vect2D {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export function AABBIntersect(rect1: Rect2D, rect2: Rect2D) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export interface IKeymap {
  left: string | string[];
  right: string | string[];
  jump: string | string[];
  atkA: string | string[];
  atkB: string | string[];
  interact: string | string[];
}

export interface IMenuButton {
  text?: string;
  rect: Rect2D;
  onClick: () => void;
  active?: boolean;
  prefab?: any;
  prefabNumber?: number;
  defaultSprite?: HTMLImageElement;
}
export function renderButton(
  ctx: CanvasRenderingContext2D,
  button: IMenuButton,
  color: string = "white",
  textColor: string = "black"
) {
  ctx.fillStyle = color;
  ctx.fillRect(
    button.rect.x,
    button.rect.y,
    button.rect.width,
    button.rect.height
  );
  ctx.fillStyle = textColor;
  ctx.font = "20px Arial";
  ctx.fillText(
    button.text ? button.text : "",
    button.rect.x +
      button.rect.width / 2 -
      ctx.measureText(button.text ? button.text : "").width / 2,
    button.rect.y + button.rect.height / 2 + 8
  );
}

export enum ColliderLayer {
  Player = 1 << 0,
  Enemy = 1 << 1,
  PlayerProjectile = 1 << 3,
  EnemyProjectile = 1 << 4,
  Ground = 1 << 5,
  Traps = 1 << 6,
  Consumable = 1 << 7,
  Utility = 1 << 8,
}

// Never used this lol
export enum ColliderMask {
  Player = ColliderLayer.Enemy |
    ColliderLayer.EnemyProjectile |
    ColliderLayer.Ground |
    ColliderLayer.Consumable,
  Enemy = ColliderLayer.Player |
    ColliderLayer.PlayerProjectile |
    ColliderLayer.Ground,
  PlayerProjectile = ColliderLayer.Enemy | ColliderLayer.Ground,
  EnemyProjectile = ColliderLayer.Player | ColliderLayer.Ground,
  Ground = ColliderLayer.Player |
    ColliderLayer.Enemy |
    ColliderLayer.PlayerProjectile |
    ColliderLayer.EnemyProjectile,
  Consumable = ColliderLayer.Player,
}
