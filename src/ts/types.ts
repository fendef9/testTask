import { Direction } from "./enums";

type CallbackType = (liftCapacity: number, floorsCount: number) => void;
type CallBack = (releaseButton: Direction, floor: number) => {};

export { CallBack, CallbackType };
