import { Container, Graphics, Text } from "pixi.js";
import { Direction } from "./enums";
import { Tween, Easing } from "@tweenjs/tween.js";
import { App as app } from "./AppSingleton";

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
}
class Human {
  constructor(humanObj: HumanObj) {
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
    this.animSpeed = humanObj.animSpeed ?? 5000;
    this.graphics = new Graphics();
    this.direction = Direction.None;
    this.container = new Container();
    this.tween = new Tween(this.container)
      .to({ x: this.moveTo }, this.animSpeed)
      .easing(Easing.Linear.In);

    this.addTicker();
  }

  public floorCurrent;
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

  private addTicker() {
    app.ticker.add(() => {
      this.tween.update();
    });
  }

  go() {
    this.tween.start();
    return this.tween;
  }

  stop() {
    this.tween.stop();
    return this.tween;
  }

  delete() {}

  see() {}

  init() {
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

    return this.container;
  }
}

export { Human };
