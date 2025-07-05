/* eslint-disable no-unused-vars */

enum Direction {
  Up,
  Down,
  None,
}

enum State {
  Wait,
  Move,
  Panding,
}

enum LookDirection {
  Left,
  Right,
  None,
}

enum HumanLiveCycle {
  None,
  Born,
  ToElevator,
  CallElevator,
  LookInside,
  ReCallElevator,
  WaitLeave,
  StepIn,
  WaitElevator,
  InElevator,
  Riding,
  Out,
  FromElevator,
  Die,
}
export { Direction, State, LookDirection, HumanLiveCycle };
