import { Container, Graphics, Text, Ticker } from "pixi.js";
import { Direction, LookDirection, HumanLiveCycle } from "./enums";
import { Tween, Easing } from "@tweenjs/tween.js";
import { Observer } from "./EventObserver";
import { Elevator } from "./Elevator";

interface HumanObj {
  floorCurrent: number;
  floorDesired: number;
  x: number;
  y: number;
  moveTo: number;
  humanWidth: number;
  humanHeight: number;
}
class Human {
  constructor(humanObj: HumanObj) {
    this.floorCurrent = humanObj.floorCurrent;
    this.floorDesired = humanObj.floorDesired;
    this.x = humanObj.x;
    this.y = humanObj.y;
    this._moveTo = humanObj.moveTo;
    this.graphics = new Graphics();
    this.container = new Container();
    this.colorUp = 0xff00ff;
    this.colorDown = 0x00ff00;
    this.width = humanObj.humanWidth;
    this.height = humanObj.humanHeight;
    this.strokeWidth = 2;
    this.animSpeed = 8000;
    this.lookDistance = 35;
    this.humanId = 0;
    this.colorCurrent = 0xff00ff;
    this.tolerance = 2;
    this.lifeCycle = HumanLiveCycle.None;
    this.direction = Direction.None;

    this.tween = this.createTween();
    this.addTicker();
  }

  private _moveTo: number;
  public floorCurrent;
  public floorDesired;
  public colorUp;
  public colorDown;
  public x;
  public y;
  public width;
  public height;
  public direction;
  public strokeWidth;
  public animSpeed;
  public lookDistance;
  public humanId;
  private tween;
  private colorCurrent;
  private graphics;
  private tolerance;
  public container;
  private startLook = true;
  private lifeCycle;
  private ticker: (() => Ticker) | null = null;
  private static humansCount = 0;

  private addTicker() {
    const func = () => {
      // !this.look() ? this.continue() : this.pause();
      this.tween.update();
    };
    Ticker.shared.add(func);
    this.ticker = () => Ticker.shared.remove(func);
  }

  // private getElevator() {
  //   const elevator = this.container.getContainerBylabel("Elevator")!;
  //   const script = elevator?.script as Elevator;

  //   return { elevator, script };
  // }

  private mainLogic() {
    // if (this.lifeCycle === HumanLiveCycle.ToElevator) {
    //   this.tween.start().onComplete(() => {
    //     this.tween.stop();
    //     this.lifeCycle = HumanLiveCycle.CallElevator;
    //     this.mainLogic();
    //     return;
    //   });
    // } else if (this.lifeCycle === HumanLiveCycle.CallElevator) {
    //   const { script } = this.getElevator();
    //   script.addStopOutdoor(this.floorCurrent);

    //   Observer.once("elevatorStopsOnFloor", (obj: { floor: number }) => {
    //     if (obj.floor === this.floorCurrent) {
    //       this.lifeCycle = HumanLiveCycle.LookInside;
    //       this.mainLogic();
    //       return;
    //     }
    //   });
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.LookInside) {
    //   const { script } = this.getElevator();
    //   const result =
    //     script.lookinside() === this.direction || script.lookinside() === Direction.None;

    //   script.mayInside() && result
    //     ? (this.lifeCycle = HumanLiveCycle.StepIn)
    //     : (this.lifeCycle = HumanLiveCycle.WaitElevator);
    //   this.mainLogic();
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.WaitElevator) {
    //   Observer.once("elevatorStopsOnFloor", (obj: { floor: number }) => {
    //     if (obj.floor === this.floorCurrent) {
    //       this.lifeCycle = HumanLiveCycle.LookInside;
    //       this.mainLogic();
    //       return;
    //     }
    //   });
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.StepIn) {
    //   const { script } = this.getElevator();
    //   console.log(`logic fires ${this.humanId}`);
    //   script.addPassanger(this);
    //   this.lifeCycle = HumanLiveCycle.InElevator;

    //   this.mainLogic();
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.InElevator) {
    //   const { script } = this.getElevator();
    //   script.addStopIndoor(this.floorDesired);
    //   this.lifeCycle = HumanLiveCycle.Riding;

    //   this.mainLogic();
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.Riding) {
    //   Observer.once("elevatorStopsOnFloor", (obj: { floor: number }) => {
    //     if (obj.floor === this.floorDesired) {
    //       this.lifeCycle = HumanLiveCycle.Out;
    //       this.mainLogic();
    //       return;
    //     }
    //   });
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.Out) {
    //   const { script } = this.getElevator();
    //   script.removePessanger(this);
    //   this.lifeCycle = HumanLiveCycle.FromElevator;

    //   this.mainLogic();
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.FromElevator) {
    //   this.moveTo = 900;
    //   this.tween.start().onComplete(() => {
    //     this.lifeCycle = HumanLiveCycle.Die;
    //     this.mainLogic();
    //     return;
    //   });
    //   return;
    // } else if (this.lifeCycle === HumanLiveCycle.Die) {
    //   this.delete();

    //   return;
    // }
  }

  private deleteTicker() {
    this.ticker?.();
  }

  set moveTo(value: number) {
    this._moveTo = value;
    this.tween = this.createTween();
  }

  get moveTo() {
    return this._moveTo;
  }

  get lookDirection(): LookDirection {
    return this.x < this.moveTo ? LookDirection.Right : LookDirection.Left;
  }

  createTween() {
    return new Tween(this.container)
      .to({ x: this._moveTo }, this.animSpeed)
      .easing(Easing.Linear.In);
  }

  private static makeHuman() {
    this.humansCount++;
  }

  //  make a setter for move to

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

  delete() {
    this.deleteTicker();
    this.container.destroy({ children: true });
  }

  look(): boolean {
    return false
    // if (!this.startLook) return false;
    // const siblings = this.container.parent;
    // if (siblings?.label !== "Humans") throw new Error("All Humnan must be in Humans container");
    // let viewPoint: number;

    // if (this.lookDirection === LookDirection.Left) {
    //   viewPoint = this.container.x - this.lookDistance;
    // } else if (this.lookDirection === LookDirection.Right) {
    //   viewPoint = this.container.x + this.lookDistance;
    // }

    // if (siblings) {
    //   const result = siblings.children.find((e) => {
    //     if (e?.script instanceof Human) {
    //       const human = e.script;
    //       if (human.lookDirection === this.lookDirection) {
    //         const x = human.container.x;

    //         return x - this.tolerance <= viewPoint && x + this.tolerance >= viewPoint;
    //       }
    //     }
    //   });
    //   if (result) return true;
    // }
    // return false;
  }

  init() {
    Human.makeHuman();
    this.lifeCycle = HumanLiveCycle.Born;
    this.humanId = Human.humansCount;
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

    this.lifeCycle = HumanLiveCycle.ToElevator;
    this.mainLogic();

    return this.container;
  }
}

export { Human };
