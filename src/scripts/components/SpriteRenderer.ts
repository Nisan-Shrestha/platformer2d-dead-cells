import { Rect2D, Vect2D } from "../utils/utils";
import { AnimInfo } from "../utils/AnimationInfo";
import Player from "../entities/Player";
enum SpriteType {
  single = 0,
  sheet = 1,
}
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
  renderingOffset: Vect2D = new Vect2D(0, 0);
  playOnce: boolean = false;
  animComplete: boolean = false;
  constructor(
    parent: any,
    width: any,
    height: any,
    animSheet: HTMLImageElement,
    animated: boolean = false,
    animInfo: AnimInfo
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
    this.animationLength = animInfo.animationLength;
    this.frameGap = animInfo.frameGap;
    this.frameCount = animInfo.frameCount;
  }

  setAnimation(
    animSheet: HTMLImageElement,
    animInfo: AnimInfo,
    once: boolean = false
  ) {
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
    this.renderingOffset.x = offset.x;
    this.renderingOffset.y = offset.y;
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
      console.log("flipped");
      ctx.translate(targetXpos + this.parent.collider.width, targetYpos);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      this.activeSprite,
      sourceXpos,
      sourceYpos,
      this.sourceFrameWidth,
      this.sourceFrameHeight,
      flipped ? 0 : targetXpos,
      flipped ? 0 : targetYpos,
      this.width,
      this.height
    );
    ctx.restore();
    // if (this.parent instanceof Player) {
    //   // if (scaleX === -1) {
    //   ctx.translate(targetXpos + this.width, 0);
    //   ctx.scale(-1, 1);
    //   // }
    // }
  }

  debugDraw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "maroon";
    ctx.fillRect(
      this.parent.position.x + this.renderingOffset.x,
      this.parent.position.y + this.renderingOffset.y,
      this.width,
      this.height
    );
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.animated)
      this.drawFrame(
        ctx,
        this.srcOffset.x,
        this.srcOffset.y,
        this.parent.position.x + this.renderingOffset.x,
        this.parent.position.y + this.renderingOffset.y
      );
    else {
      this.drawFrame(
        ctx,
        this.frameIndex * this.sourceFrameWidth,
        0,
        this.parent.position.x + this.renderingOffset.x,
        this.parent.position.y + this.renderingOffset.y,
        this.parent.flipped
      );
    }
  }
  update(delta: number) {
    if (this.animated) {
      this.animationProgress += delta / this.animationLength;
      this.frameIndex = Math.floor(this.animationProgress * this.frameCount);
      if (!this.playOnce && this.animationProgress >= 1) {
        this.animationProgress = this.animationProgress % 1;
      } else if (this.playOnce && this.animationProgress >= 1) {
        this.frameIndex = this.frameCount - 1;
        this.animationProgress = 1;
        this.animComplete = true;
      }
    }
    // console.log(this.frameIndex, this.animationProgress, this.animComplete);
  }
}

export default SpriteRenderer;
