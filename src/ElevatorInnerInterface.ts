import { Elevator } from "./Elevator";

class ElevatorInnerInterface {
  constructor(elevator: Elevator) {
    this.elevator = elevator;
  }

  private elevator: Elevator;

  public pressButton(floor: number) {
    this.elevator.innerStopFloors.push(floor);
    this.elevator.innerButtonPressed();
  }
}

export { ElevatorInnerInterface };
