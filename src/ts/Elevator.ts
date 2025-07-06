import { Easing, Tween } from "@tweenjs/tween.js";
import { Container, Graphics, Ticker } from "pixi.js";
import { Observer } from "./EventObserver";
import { Utils } from "./Utils";
import { Human } from "./Human";
import { Direction, State } from "./enums";

interface ElevatorObj {
  x: number;
  y: number;
  floorHeight: number;
  elevatorShaftWidth: number;
  floorTotal: number;
  elevatorCapacity: number;
  floorStart: number;
}

class Elevator {
  constructor(elevatorObj: ElevatorObj) {
    this.x = elevatorObj.x;
    this.y = elevatorObj.y;
    this.floorHeight = elevatorObj.floorHeight;
    this.floorTotal = elevatorObj.floorTotal;
    this.elevatorCapacity = elevatorObj.elevatorCapacity;
    this.currentFloor = elevatorObj.floorStart;
    this.elevatorShaftWidth = elevatorObj.elevatorShaftWidth;
    this.currentElevatorCapacity = 0;
    this.direction = Direction.Up;
    this.humansDirection = Direction.None;
    this.isDoorOpen = false;
    this.allStops = [];
    this.graphics = new Graphics();
    this.container = new Container();
    this.movingSpeed = 1000; // in ms
    this.waitingTime = 800; // in ms
    this.humanIndex = [];
    this.addTicker();

    Elevator.instances.push(this);
  }

  private x;
  private y;
  private direction;
  private floorTotal;
  private floorHeight;
  private elevatorCapacity;
  private currentElevatorCapacity;
  private tween: null | Tween = null;
  private graphics;
  private container;
  public currentFloor;
  private elevatorShaftWidth;
  private humanIndex: string[] | null[];
  private allStops: number[];
  private ticker: null | (() => Ticker) = null;
  private humansDirection: Direction;
  public isDoorOpen: boolean;
  public movingSpeed;
  public waitingTime;
  private static instances: Elevator[] = [];
  private isDestroy = false;

  static wipe() {

    Elevator.instances.forEach((v) => {
      v.isDestroy = true;
      v.delete();
    });
    Elevator.instances = [];
  }

  delete() {
    Ticker.shared.stop();
    this.deleteTicker();
    this.tween?.stop();
    this.tween = null;
    this.container.destroy(true);
  }

  public init() {
    this.graphics
      .moveTo(10, 10)
      .lineTo(this.elevatorShaftWidth - 10, 10)
      .lineTo(this.elevatorShaftWidth - 10, 15)
      .moveTo(this.elevatorShaftWidth - 10, this.floorHeight - 5)
      .lineTo(this.elevatorShaftWidth - 10, this.floorHeight)
      .lineTo(10, this.floorHeight)
      .lineTo(10, 8)
      .stroke({ width: 5, color: 0xfeeb77 });

    this.graphics.y = this.translatePos(this.currentFloor);

    this.container.label = "Elevator";
    this.container.addChild(this.graphics);

    for (let i = 0; i < this.elevatorCapacity; i++) {
      this.humanIndex[i] = null;
    }

    this.elevatorLogic();
    return this.container;
  }

  get seatsLeft() {
    return this.elevatorCapacity - this.currentElevatorCapacity;
  }

  public mayInside() {
    const res = this.seatsLeft <= 0 || this.seatsLeft > this.elevatorCapacity;
    const res1 = this.currentElevatorCapacity <= this.elevatorCapacity && this.isDoorOpen;
    return !res && res1;
  }

  public addPassanger(passanger: Human) {
    if (this.seatsLeft === this.elevatorCapacity) this.humansDirection = passanger.direction;

    const y = this.floorHeight * this.floorTotal - 30;
    const placeArr = [
      { x: 40, y },
      { x: 80, y },
      { x: 120, y },
      { x: 160, y },
    ];

    const index = this.humanIndex.findIndex((v) => v === null);

    this.humanIndex[index] = passanger.container.label;

    const pos = placeArr[index];

    const humanContainer = passanger.container;
    const parent = humanContainer.parent;

    parent.removeChild(humanContainer);

    passanger.teleport(pos.x, pos.y);

    this.container.addChild(humanContainer);

    this.currentElevatorCapacity += 1;

    Observer.emit("elevatorStateUpdated", { floor: this.currentFloor, state: State.SomeoneEnter });
  }

  public removePessanger(passanger: Human) {
    const index = this.humanIndex.findIndex((v) => v === passanger.container.label);
    this.humanIndex[index] = null;

    const humanContainer = passanger.container;
    const parent = humanContainer.parent;
    parent.removeChild(humanContainer);

    const floor = parent.getContainerBylabel(`Floor: ${passanger.floorDesired}`)!;

    floor?.addChild(humanContainer);
    passanger.teleport(215, (this.floorTotal - passanger.floorDesired) * this.floorHeight + 40);

    this.currentElevatorCapacity -= 1;
    if (this.seatsLeft === this.elevatorCapacity) {
      this.humansDirection = Direction.None;
      Observer.emit("elevatorStateUpdated", {
        floor: this.currentFloor,
        state: State.ElevatorEmpty,
      });
    }
    Observer.emit("elevatorStateUpdated", { floor: this.currentFloor, state: State.SomeoneExit });
  }

  public lookinside() {
    return this.humansDirection;
  }

  private translatePos(value: number) {
    const result = (this.floorTotal - value) * this.floorHeight;
    return result;
  }

  moveOneFloor(direction: Direction, onComplite: () => void) {
    if (this.isDestroy) return;
    let to;
    let floor = this.currentFloor;

    const startMooving = (to: number) => {
      this.tween = new Tween(this.container)
        .to({ y: to }, this.movingSpeed)
        .easing(Easing.Linear.In)
        .start()
        .onComplete(() => {
          if (this.isDestroy) return;
          Observer.emit("elevatorLeavesFloor", { floor: this.currentFloor });
          Observer.emit("elevatorStateUpdated", {
            floor: this.currentFloor,
            state: State.LiveFloor,
          });
          this.currentFloor = floor;
          onComplite.call(this);
        });
    };
    if (direction === Direction.Up) {
      to = this.container.y - this.floorHeight;
      floor += 1;
      startMooving(to);
    } else if (direction === Direction.Down) {
      to = this.container.y + this.floorHeight;
      floor -= 1;
      startMooving(to);
    }
  }

  private deleteStop(floor: number) {
    this.allStops = this.allStops.filter((v) => v !== floor);
  }

  elevatorLogic() {
    const result = this.allStops.length;

    if (this.currentFloor === this.floorTotal) this.direction = Direction.Down;
    else if (this.currentFloor === 1) this.direction = Direction.Up;
    else if (this.humansDirection !== Direction.None) this.direction = this.humansDirection;

    if (result === 0) {
      this.moveOneFloor(this.direction, this.elevatorLogic);
    } else {
      this.moveOneFloor(this.direction, this.stop);
    }
  }

  stop() {
    if (this.allStops.includes(this.currentFloor)) {
      this.deleteStop(this.currentFloor);
      this.isDoorOpen = true;
      Observer.emit("elevatorStopsOnFloor", { floor: this.currentFloor });
      Observer.emit("elevatorStateUpdated", { floor: this.currentFloor, state: State.DoorOpen });

      Utils.setTimeout(() => {
        this.isDoorOpen = false;
        Observer.emit("elevatorStateUpdated", {
          floor: this.currentFloor,
          state: State.DoorClosed,
        });

        this.elevatorLogic();
      }, this.waitingTime);
    } else this.elevatorLogic();
  }

  public addStop(value: number) {
    if (this.allStops.includes(value)) return;
    this.allStops.push(value);
  }

  private addTicker() {
    const func = () => {
      this.tween?.update();
    };

    Ticker.shared.add(func);
    this.ticker = () => Ticker.shared.remove(func);
  }

  private deleteTicker() {
    this.ticker?.();
  }
}
export { Elevator };
