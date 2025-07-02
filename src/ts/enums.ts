/* eslint-disable @/no-unused-vars */
/* eslint-disable no-unused-vars */

enum Direction {
  Up,
  Down,
  None,
}

enum State {
  Wait,
  Move,
}

enum LookDirection {
  Left,
  Right,
  None,
}

enum HumanLiveCycle {
  Born,
  ToElevator,
  InToElevator,
  FromElevator,
  Die,
}
export { Direction, State, LookDirection, HumanLiveCycle };
