import { State, Direction } from "./enums";
import { callObj } from "./interfaces";
import { CallBack } from "./types";

class Elevator {
  constructor(floorsTotal = 4, maxCapasity = 2) {
    this.maxCapacity = maxCapasity;
    this.floorsTotal = floorsTotal;
  }

  maxCapacity: number;
  floorsTotal: number;

  peopleInElevator = 0;
  currentDirection = Direction.Up;
  directionRelativeToCall = Direction.Up;
  directionWhenArrive = Direction.Up;
  currentFloor = 1;
  targetFloor = 1;
  state = State.Wait;
  movingSpeed = 1; // in floors per second
  stopTime = 800; // in ms
  wait = false;

  innerStopFloors: number[] = [];
  outerStopfloors: callObj[] = [];
  events: CallBack[] = [];

  subscribe(cb: CallBack) {
    this.events.push(cb);
  }

  unsubscribe(cb: CallBack) {
    this.events = this.events.filter((observer) => observer !== cb);
  }

  notify(releaseButton: Direction, floor: number) {
    this.events.forEach((fn) => fn(releaseButton, floor));
  }

  // addStop() { }
  // move() { }
  // stop() { }
  outerButtonPressed() {
    console.log(`outerButtonPressed`);
  }
  innerButtonPressed() {
    console.log(`innererButtonPressed`);
  }

  startWaitTimer() {
    // eslint-disable-next-line
    setTimeout(() => {}, this.stopTime);
  }
}

export { Elevator };
