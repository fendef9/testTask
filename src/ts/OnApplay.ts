import { CallbackType } from "./types";

class OnApplay {
  static callback: CallbackType | null;

  static handler(liftCapacity: number, floorsCount: number) {
    this.callback?.(liftCapacity, floorsCount);
  }
}

export { OnApplay };
