import { Elevator } from "./Elevator";
import { Direction, State } from "./enums";

class ElevatorOuterInterface {
  constructor(floor: number, elevator: Elevator) {
    this.floor = floor;
    this.upIsPressed = Direction.None;
    this.downIsPressed = Direction.None;
    this.elevator = elevator;
    this.elevator.subscribe(() => this.releaseButton);
  }

  private elevator: Elevator;
  private floor: number;
  public upIsPressed: Direction;
  public downIsPressed: Direction;

  private releaseButton(releaseButton: Direction, floor: number) {
    if (floor === this.floor) {
      switch (releaseButton) {
        case Direction.Up:
          this.upIsPressed = Direction.None;
          break;

        case Direction.Down:
          this.downIsPressed = Direction.None;
          break;

        default:
          throw new Error("Something with types in callback while elevator done");
      }
    }
  }

  public pressButton(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        this.upIsPressed = direction;
        break;

      case Direction.Down:
        this.downIsPressed = direction;
        break;

      default:
        throw new Error("Something with types while press");
    }

    this.elevator.outerStopfloors.push({
      floor: this.floor,
      direction,
    });

    if (this.check()) this.elevator.outerButtonPressed();
  }

  private check() {
    if (
      this.elevator.innerStopFloors.length === 0 &&
      this.elevator.outerStopfloors.length === 0 &&
      this.elevator.state === State.Wait
    )
      return true;

    return false;
  }
}

export { ElevatorOuterInterface };
