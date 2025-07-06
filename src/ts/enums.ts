/* eslint-disable no-unused-vars */

enum Direction {
  Up,
  Down,
  None,
}

enum State {
  DoorOpen,
  DoorClosed,
  ElevatorEmpty,
  SomeoneExit,
  SomeoneEnter,
  LiveFloor,
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
  ElevatorUpdateState,
  WaitUpdate,
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
