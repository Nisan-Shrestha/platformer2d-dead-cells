import LevelManager from "../main/LevelManager";
import { IAnimInfo } from "../utils/AnimationInfo";
import { Vect2D } from "../utils/utils";

export class SpriteRenderer {
  parent: any;
  width: number;
  height: number;
  srcOffset: Vect2D = new Vect2D(0, 0);
  // imageSrc: string;
  activeSprite: HTMLImageElement;
  animated: boolean = false;
  sourceFrameWidth: number = 0;
  sourceFrameHeight: number = 0;
  animationProgress: number = 0;
  animationLength: number = 1;
  frameIndex: number = 0;
  frameCount: number = 1;
  frameGap: number = 0;
  spriteRenderingOffset: Vect2D = new Vect2D(0, 0);
  playOnce: boolean = false;
  animComplete: boolean = false;
  constructor(
    parent: any,
    width: any,
    height: any,
    animSheet: HTMLImageElement,
    animated: boolean = false,
    animInfo: IAnimInfo | null = null
  ) {
    this.parent = parent;
    this.width = width;
    this.height = height;
    // this.imageSrc = imageSrc;
    // this.sourceImgElement = new Image();
    this.activeSprite = animSheet;
    this.sourceFrameHeight = this.height;
    this.sourceFrameWidth = this.width;
    this.animated = animated;
    if (animInfo) {
      this.animationLength = animInfo.animationLength;
      this.frameGap = animInfo.frameGap;
      this.frameCount = animInfo.frameCount;
    }
  }

  setAnimation(
    animSheet: HTMLImageElement,
    animInfo: IAnimInfo,
    once: boolean = false
  ) {
    this.animComplete = false;
    this.animationProgress = 0;
    this.frameIndex = 0;
    this.activeSprite = animSheet;
    this.animationLength = animInfo.animationLength;
    this.frameGap = animInfo.frameGap;
    this.frameCount = animInfo.frameCount;
    this.playOnce = once;
  }

  isAnimComplete() {
    return this.animComplete;
  }

  setSourceFrameSize(size: Vect2D) {
    this.sourceFrameWidth = size.x;
    this.sourceFrameHeight = size.y;
  }
  setTargetSize(size: Vect2D) {
    this.width = size.x;
    this.height = size.y;
  }
  setSourceOffset(offset: Vect2D) {
    this.srcOffset.x = offset.x;
    this.srcOffset.y = offset.y;
  }
  setRenderOffset(offset: Vect2D) {
    this.spriteRenderingOffset.x = offset.x;
    this.spriteRenderingOffset.y = offset.y;
  }

  drawFrame(
    ctx: CanvasRenderingContext2D,
    sourceXpos: number,
    sourceYpos: number,
    targetXpos: number,
    targetYpos: number,
    flipped: boolean = false
  ) {
    ctx.save();
    if (flipped) {
      // console.log("flipped");
      ctx.translate(
        targetXpos + this.parent.collider.width - LevelManager.cameraOffsetX,
        targetYpos - LevelManager.cameraOffsetY
      );
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      this.activeSprite,
      sourceXpos,
      sourceYpos,
      this.sourceFrameWidth,
      this.sourceFrameHeight,
      flipped ? 0 : targetXpos - LevelManager.cameraOffsetX,
      flipped ? 0 : targetYpos - LevelManager.cameraOffsetY,
      this.width,
      this.height
    );
    ctx.restore();
  }

  debugDraw(ctx: CanvasRenderingContext2D) {
    SpriteRenderer.drawOffsetRect(
      ctx,
      this.parent.position.x + this.spriteRenderingOffset.x,
      this.parent.position.y + this.spriteRenderingOffset.y,
      this.width,
      this.height,
      "maroon",
      0.5
    );
  }

  render(ctx: CanvasRenderingContext2D, alpha: number = 1) {
    let t = ctx.globalAlpha;
    ctx.globalAlpha = alpha;
    if (!this.animated)
      this.drawFrame(
        ctx,
        this.srcOffset.x,
        this.srcOffset.y,
        this.parent.position.x + this.spriteRenderingOffset.x,
        this.parent.position.y + this.spriteRenderingOffset.y,
        this.parent.flipped
      );
    else {
      this.drawFrame(
        ctx,
        this.frameIndex * this.sourceFrameWidth,
        0,
        this.parent.position.x + this.spriteRenderingOffset.x,
        this.parent.position.y + this.spriteRenderingOffset.y,
        this.parent.flipped
      );
    }
    ctx.globalAlpha = t;
  }
  update(delta: number) {
    if (this.animated) {
      this.animationProgress += delta / this.animationLength;
      if (!this.playOnce && this.animationProgress >= 1) {
        this.animationProgress = this.animationProgress % 1;
        this.frameIndex = Math.floor(this.animationProgress * this.frameCount);
      }
      this.frameIndex = Math.floor(this.animationProgress * this.frameCount);
      if (this.playOnce && this.animationProgress >= 1) {
        this.frameIndex = this.frameCount - 1;
        this.animationProgress = 1;
        this.animComplete = true;
      }
    }
    // console.log(this.frameIndex, this.animationProgress, this.animComplete);
  }

  static drawOffsetRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string = "purple",
    alpha: number = 1
  ) {
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(
      x - LevelManager.cameraOffsetX,
      y - LevelManager.cameraOffsetY,
      w,
      h
    );
    ctx.globalAlpha = 1;
  }
}

export default SpriteRenderer;
