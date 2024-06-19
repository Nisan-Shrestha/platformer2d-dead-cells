import { Rect2D, Vect2D } from "../utils/utils";
enum SpriteType {
  single = 0,
  sheet = 1,
}
export class SpriteRenderer {
  parent: any;
  width: number;
  height: number;
  // imageSrc: string;
  sourceImgElement: HTMLImageElement;
  sprteType: SpriteType = SpriteType.single;
  animated: boolean = false;
  sourceFrameWidth: number = 0;
  sourceFrameHeight: number = 0;
  animationProgress: number = 0;
  animationLength: number = 1;
  posArray: Vect2D[] = [new Vect2D(0, 0)];
  staticOffset: Vect2D = new Vect2D(0, 0);
  constructor(
    parent: any,
    width: any,
    height: any,
    sourceImgElement: HTMLImageElement,
    animated: boolean = false,
    animationLength: number = 1,
    posArray: Vect2D[] = [new Vect2D(0, 0)]
  ) {
    this.parent = parent;
    this.width = width;
    this.height = height;
    // this.imageSrc = imageSrc;
    // this.sourceImgElement = new Image();
    this.sourceImgElement = sourceImgElement;
    this.sourceFrameHeight = this.height;
    this.sourceFrameWidth = this.height;
    this.animated = animated;
    this.animationLength = animationLength;
    this.posArray = posArray;
  }

  setSourceFrameSize(size: Vect2D) {
    this.sourceFrameWidth = size.x;
    this.sourceFrameHeight = size.y;
  }
  setTargetSize(size: Vect2D) {
    this.width = size.x;
    this.height = size.y;
  }
  setStaticSourceOffset(offset: Vect2D) {
    this.staticOffset.x = offset.x;
    this.staticOffset.y = offset.y;
  }
  drawFrame(
    ctx: CanvasRenderingContext2D,
    sourceXpos: number,
    sourceYpos: number,
    targetXpos: number,
    targetYpos: number
  ) {
    ctx.drawImage(
      this.sourceImgElement,
      sourceXpos,
      sourceYpos,
      this.sourceFrameWidth,
      this.sourceFrameHeight,
      targetXpos,
      targetYpos,
      this.width,
      this.height
    );
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.animated)
      this.drawFrame(
        ctx,
        this.staticOffset.x,
        this.staticOffset.y,
        this.parent.position.x,
        this.parent.position.y
      );
    else {
      this.drawFrame(
        ctx,
        this.posArray[this.animationProgress * this.posArray.length].x,
        this.posArray[this.animationProgress * this.posArray.length].y,
        this.parent.position.x,
        this.parent.position.y
      );
    }
  }
  update(delta: number) {
    if (this.animated) {
      this.animationProgress += delta / this.animationLength;
      this.animationProgress = this.animationProgress % 1;
    }
  }
}

export default SpriteRenderer;
