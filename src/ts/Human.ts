import { Container, Graphics, Text, Ticker } from "pixi.js";
import { Direction, LookDirection, HumanLiveCycle, State } from "./enums";
import { Tween, Easing } from "@tweenjs/tween.js";
import { Observer } from "./EventObserver";
import { Elevator } from "./Elevator";
import { Utils } from "./Utils";

interface HumanObj {
  floorCurrent: number;
  floorDesired: number;
  x: number;
  y: number;
  moveTo: number;
  humanWidth: number;
  humanHeight: number;
  elevator: Elevator;
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
    this.animSpeed = Utils.random(5000, 8000);
    this.lookDistance = 40;
    this.humanId = 0;
    this.colorCurrent = 0xff00ff;
    this.tolerance = 4;
    this.lifeCycle = HumanLiveCycle.None;
    this.direction = Direction.None;
    this.elevator = humanObj.elevator;

    this.tween = this.createTween();
    this.addTicker();

    Human.instances.push(this);
  }

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
  public container;
  private _moveTo: number;
  private tween: Tween | null;
  private colorCurrent;
  private graphics;
  private tolerance;
  private elevator: Elevator | null;
  private lifeCycle;
  private ticker: (() => Ticker) | null = null;
  private static instances: Human[] = [];
  private static humansCount = 0;

  private addTicker() {
    const func = () => {
      !this.look() ? this.continue() : this.pause();
      this.tween?.update();
    };
    Ticker.shared.add(func);
    this.ticker = () => Ticker.shared.remove(func);
  }

  private mainLogic() {
    if (this.lifeCycle === HumanLiveCycle.Born) {
      this.container.lookingDirection = this.lookDirection;
      this.lifeCycle = HumanLiveCycle.ToElevator;

      this.mainLogic();
      return;
    } else if (this.lifeCycle === HumanLiveCycle.ToElevator) {
      this.tween?.start().onComplete(() => {
        this.tween?.stop();
        this.lifeCycle = HumanLiveCycle.CallElevator;

        this.mainLogic();
        return;
      });
    } else if (this.lifeCycle === HumanLiveCycle.CallElevator) {
      if (this.elevator?.isDoorOpen && this.elevator.currentFloor === this.floorCurrent) {
        this.lifeCycle = HumanLiveCycle.LookInside;
        this.mainLogic();
        return;
      }
      this.elevator?.addStop(this.floorCurrent);
      this.lifeCycle = HumanLiveCycle.WaitElevator;

      Observer.once("elevatorStopsOnFloor", (obj: { floor: number }) => {
        if (obj.floor === this.floorCurrent && this.lifeCycle === HumanLiveCycle.WaitElevator) {
          this.lifeCycle = HumanLiveCycle.LookInside;
          this.mainLogic();
          return;
        }
      });

      return;
    } else if (this.lifeCycle === HumanLiveCycle.WaitElevator) {
      return;
    } else if (this.lifeCycle === HumanLiveCycle.LookInside) {
      const result =
        this.elevator?.lookinside() === this.direction ||
        this.elevator?.lookinside() === Direction.None;

      this.elevator?.mayInside() && result
        ? (this.lifeCycle = HumanLiveCycle.StepIn)
        : (this.lifeCycle = HumanLiveCycle.ElevatorUpdateState);
      this.mainLogic();
      return;
    } else if (this.lifeCycle === HumanLiveCycle.ElevatorUpdateState) {
      this.lifeCycle = HumanLiveCycle.WaitUpdate;

      const handler = (obj: { floor: number; state: State }) => {
        if (obj.floor !== this.floorCurrent || this.lifeCycle !== HumanLiveCycle.WaitUpdate) return;
        if (obj.state === State.LiveFloor) {
          Observer.off("elevatorStateUpdated", handler);
          this.lifeCycle = HumanLiveCycle.CallElevator;
          this.mainLogic();
          return;
        }

        if (this.elevator?.isDoorOpen && obj.state === State.ElevatorEmpty) {
          Observer.off("elevatorStateUpdated", handler);
          this.lifeCycle = HumanLiveCycle.LookInside;
          this.mainLogic();
          return;
        }
      };

      Observer.on("elevatorStateUpdated", handler);

      return;
    } else if (this.lifeCycle === HumanLiveCycle.WaitUpdate) return;
    else if (this.lifeCycle === HumanLiveCycle.StepIn) {
      this.elevator?.addPassanger(this);
      this.lifeCycle = HumanLiveCycle.InElevator;

      this.mainLogic();
      return;
    } else if (this.lifeCycle === HumanLiveCycle.InElevator) {
      this.elevator?.addStop(this.floorDesired);
      this.lifeCycle = HumanLiveCycle.Riding;

      this.mainLogic();
      return;
    } else if (this.lifeCycle === HumanLiveCycle.Riding) {
      Observer.once("elevatorStopsOnFloor", (obj: { floor: number }) => {
        if (obj.floor === this.floorDesired && this.lifeCycle === HumanLiveCycle.Riding) {
          this.lifeCycle = HumanLiveCycle.Out;
          this.mainLogic();
          return;
        }
      });
      return;
    } else if (this.lifeCycle === HumanLiveCycle.Out) {
      this.elevator?.removePessanger(this);
      this.lifeCycle = HumanLiveCycle.FromElevator;

      this.mainLogic();
      return;
    } else if (this.lifeCycle === HumanLiveCycle.FromElevator) {
      this.container.lookingDirection = this.lookDirection;
      this.moveTo = 900;
      this.tween?.start().onComplete(() => {
        this.lifeCycle = HumanLiveCycle.Die;
        this.mainLogic();
        return;
      });
      return;
    } else if (this.lifeCycle === HumanLiveCycle.Die) {
      this.delete();

      return;
    }
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

  pause() {
    this.tween?.pause();
  }

  continue() {
    this.tween?.resume();
  }

  teleport(x: number, y: number) {
    this.container.x = x;
    this.container.y = y;
  }

  stop() {
    this.tween?.stop();
  }

  delete() {
    this.deleteTicker();
    this.tween = null;
    this.elevator = null;
    this.container.destroy(true);
  }

  static wipe() {
    Human.instances.forEach((v) => v.delete());
    Human.instances = [];
  }

  look(): boolean {
    const siblings = this.container.parent;
    if (siblings?.label !== "Humans") return false;
    let viewPoint: number;

    if (this.lookDirection === LookDirection.Left) {
      viewPoint = this.container.x - this.lookDistance;
    } else if (this.lookDirection === LookDirection.Right) {
      viewPoint = this.container.x + this.lookDistance;
    }

    if (siblings) {
      const result = siblings.children.find((e) => {
        if (e.label.includes(`Human: `)) {
          if (e.lookingDirection === this.lookDirection) {
            const x = e.x;

            return x - this.tolerance <= viewPoint && x + this.tolerance >= viewPoint;
          }
        }
      });
      if (result) return true;
    }
    return false;
  }

  init() {
    Human.makeHuman();
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

    this.lifeCycle = HumanLiveCycle.Born;
    this.mainLogic();

    return this.container;
  }
}

export { Human };
