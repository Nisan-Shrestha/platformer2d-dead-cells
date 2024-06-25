import { AnimInfo, IAnimInfo } from "../../utils/AnimationInfo";
import Weapon from "./Weapon";
import { AABBIntersect, Rect2D, Vect2D } from "../../utils/utils";
import SpriteRenderer from "../SpriteRenderer";
import RectCollider from "../RectCollider";
import LevelManager from "../../main/LevelManager";
export default class Projectile extends Weapon {
  icon: HTMLImageElement;
  damage: number;
  animInfo: IAnimInfo;
  projectileSheet: HTMLImageElement;
  position: Vect2D;
  velocity: Vect2D;
  flipped: boolean = false;
  spriteRenderer: SpriteRenderer;
  static allProjectiles: Projectile[] = [];
  constructor(
    name: string,
    damage: number,
    icon: HTMLImageElement,
    animInfo: IAnimInfo,
    projectileSheet: HTMLImageElement,
    position: Vect2D,
    targetSize: Vect2D,
    sourceSize: Vect2D,
    velocity: Vect2D = new Vect2D(0, 0),
    flipped: boolean = false
  ) {
    super(name);
    this.icon = icon;
    this.animInfo = animInfo;
    this.projectileSheet = projectileSheet;
    this.position = position;
    this.velocity = velocity;
    this.flipped = flipped;
    this.spriteRenderer = new SpriteRenderer(
      this,
      targetSize.x,
      targetSize.y,
      projectileSheet,
      false,
      AnimInfo.base
    );
    this.damage = damage;

    this.spriteRenderer.setSourceFrameSize(sourceSize);
  }
  update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
  }

  static checkProjectileCollisions() {
    Projectile.checkPlayerProjectileEffect();
    Projectile.checkEnemyProjectileEffect();
  }

  static checkEnemyProjectileEffect() {
    RectCollider.EnemyProjectileColliderArray.forEach(
      (enemyProjectileCollider) => {
        if (LevelManager.player!.invincible) return;
        let enemyProjectileRect = new Rect2D(
          enemyProjectileCollider.parentObj.position.x,
          enemyProjectileCollider.parentObj.position.y,
          enemyProjectileCollider.width,
          enemyProjectileCollider.height
        );

        let playerRect = new Rect2D(
          LevelManager.player!.position.x,
          LevelManager.player!.position.y,
          LevelManager.player!.collider.width,
          LevelManager.player!.collider.height
        );
        if (AABBIntersect(enemyProjectileRect, playerRect)) {
          LevelManager.player!.getHurt(
            enemyProjectileCollider.parentObj.damage * LevelManager.DamageModFactor
          );
          Projectile.allProjectiles.splice(
            Projectile.allProjectiles.indexOf(
              enemyProjectileCollider.parentObj
            ),
            1
          );
          RectCollider.EnemyProjectileColliderArray.splice(
            RectCollider.EnemyProjectileColliderArray.indexOf(
              enemyProjectileCollider
            ),
            1
          );
        }
        RectCollider.groundColliderArray.forEach((groundCollider) => {
          let groundRect = new Rect2D(
            groundCollider.parentObj.position.x,
            groundCollider.parentObj.position.y,
            groundCollider.width,
            groundCollider.height
          );
          if (AABBIntersect(enemyProjectileRect, groundRect)) {
            Projectile.allProjectiles.splice(
              Projectile.allProjectiles.indexOf(
                enemyProjectileCollider.parentObj
              ),
              1
            );
            RectCollider.EnemyProjectileColliderArray.splice(
              RectCollider.EnemyProjectileColliderArray.indexOf(
                enemyProjectileCollider
              ),
              1
            );
          }
        });
      }
    );
  }
  static checkPlayerProjectileEffect() {
    RectCollider.PlayerProjectileColliderArray.forEach(
      (playerProjectileCollider) => {
        let playerProjectileRect = new Rect2D(
          playerProjectileCollider.parentObj.position.x,
          playerProjectileCollider.parentObj.position.y,
          playerProjectileCollider.width,
          playerProjectileCollider.height
        );
        RectCollider.EnemyColliderArray.forEach((enemyCollider) => {
          if (enemyCollider.parentObj.invincible) return;
          let enemyColliderRect = new Rect2D(
            enemyCollider.parentObj.position.x,
            enemyCollider.parentObj.position.y,
            enemyCollider.width,
            enemyCollider.height
          );
          if (AABBIntersect(playerProjectileRect, enemyColliderRect)) {
            enemyCollider.parentObj.getHurt(
              playerProjectileCollider.parentObj.damage *
                LevelManager.player!.damageMult
            );
            Projectile.allProjectiles.splice(
              Projectile.allProjectiles.indexOf(
                playerProjectileCollider.parentObj
              ),
              1
            );
            RectCollider.PlayerProjectileColliderArray.splice(
              RectCollider.PlayerProjectileColliderArray.indexOf(
                playerProjectileCollider
              ),
              1
            );
          }
        });
        RectCollider.groundColliderArray.forEach((groundCollider) => {
          let groundRect = new Rect2D(
            groundCollider.parentObj.position.x,
            groundCollider.parentObj.position.y,
            groundCollider.width,
            groundCollider.height
          );
          if (AABBIntersect(playerProjectileRect, groundRect)) {
            Projectile.allProjectiles.splice(
              Projectile.allProjectiles.indexOf(
                playerProjectileCollider.parentObj
              ),
              1
            );
            RectCollider.PlayerProjectileColliderArray.splice(
              RectCollider.PlayerProjectileColliderArray.indexOf(
                playerProjectileCollider
              ),
              1
            );
          }
        });
      }
    );
  }

  render(ctx: CanvasRenderingContext2D) {
    this.spriteRenderer.render(ctx);
  }
}
