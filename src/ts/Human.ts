import { Container, Graphics, Text } from "./PixiExtention";
import { Direction, LookDirection } from "./enums";
import { Tween, Easing } from "@tweenjs/tween.js";
import { App as app } from "./AppSingleton";
import { EventObserver, CustomEvents } from "./EventObserver";

const emmiter = new EventObserver<CustomEvents>();

interface HumanObj {
  floorCurrent: number;
  floorDesired: number;
  colorUp?: number;
  colorDown?: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  moveTo: number;
  strokeWidth?: number;
  animSpeed?: number;
  humanId: number;
  lookDistance?: number;
  lookDirection?: LookDirection;
}
class Human {
  constructor(humanObj: HumanObj) {
    this.humanId = humanObj.humanId;
    this.floorCurrent = humanObj.floorCurrent;
    this.floorDesired = humanObj.floorDesired;
    this.colorUp = humanObj.colorUp ?? 0xff00ff;
    this.colorDown = humanObj.colorDown ?? 0x00ff00;
    this.x = humanObj.x;
    this.y = humanObj.y;
    this.width = humanObj.width ?? 30;
    this.height = humanObj.height ?? 50;
    this.moveTo = humanObj.moveTo;
    this.colorCurrent = 0xff00ff;
    this.strokeWidth = humanObj.strokeWidth ?? 2;
    this.animSpeed = humanObj.animSpeed ?? 8000;
    this.lookDistance = humanObj.lookDistance ?? 35;
    this.lookDirection = humanObj.lookDirection ?? LookDirection.Left;
    this.tolerance = 2;
    this.graphics = new Graphics();
    this.direction = Direction.None;
    this.container = new Container();
    this.tween = this.createTween();
    this.addTicker();
  }

  public floorCurrent;
  public lookDirection;
  public humanId;
  public floorDesired;
  public colorUp;
  public colorDown;
  public x;
  public y;
  public width;
  public height;
  public moveTo;
  public direction;
  public strokeWidth;
  public animSpeed;
  private tween;
  private colorCurrent;
  private graphics;
  private container;
  public lookDistance;
  private tolerance;

  private addTicker() {
    app.ticker.add(() => {
      this.tween.update();
      this.look() && this.stop();
    });
  }

  go() {
    this.tween.start().onComplete(() => {
      emmiter.emit("animationEnds", { entityId: this.humanId });
    });
  }

  createTween(moveTo?: number) {
    if (moveTo) this.moveTo = moveTo;

    return new Tween(this.container)
      .to({ x: this.moveTo }, this.animSpeed)
      .easing(Easing.Linear.In);
  }

  pause() {
    this.tween.pause();
  }

  continue() {
    this.tween.resume();
  }

  teleport(x: number, y: number) {
    this.container.x = x;
    this.container.y = y;
  }

  stop() {
    this.tween.stop();
  }

  delete() {}

  look(): boolean {
  
    const siblibgs = this.container.getContainerBylabel("Humans")?.children;
    let viewPoint: number;

    if (this.lookDirection === LookDirection.Left) viewPoint = this.container.x + -this.lookDistance;
    else if (this.lookDirection === LookDirection.Right) viewPoint = this.container.x + this.lookDistance;

    if (siblibgs) {
      const result = siblibgs.find((e) => {
        return e.x - this.tolerance <= viewPoint && e.x + this.tolerance >= viewPoint;
      });

      if (result && result.label?.includes("Human")) {
        // console.log(`Human: ${this.humanId} see!`);
        return true
      };
    }
    return false;
  }

  init() {
    this.container.label = `Human: ${this.humanId}`;

    if (this.floorCurrent > this.floorDesired) {
      this.direction = Direction.Down;
      this.colorCurrent = this.colorDown;
    } else {
      this.direction = Direction.Up;
      this.colorCurrent = this.colorUp;
    }

    this.graphics
      .rect(0, 0, this.width, this.height)
      .stroke({ width: this.strokeWidth, color: this.colorCurrent });

    const t = new Text({ text: `${this.floorDesired}` });
    this.graphics.pivot.set(this.graphics.width / 2, this.graphics.height / 2);
    t.pivot.set(t.width / 2, t.height / 2);

    this.container.addChild(this.graphics, t);
    this.container.x = this.x;
    this.container.y = this.y;

    this.container.script = this; // ?? maybe not need

    return this.container;
  }
}

export { Human };
