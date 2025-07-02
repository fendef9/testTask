import { Ticker } from "pixi.js";

class Utils {
  static setInterval(cb: () => void, time: number) {
    let elapsed = 0;
    const func = () => {
      elapsed += ticker.deltaMS;
      if (elapsed >= time) {
        elapsed = 0;
        cb();
      }
    };
    const ticker = Ticker.shared.add(func);

    return () => Ticker.shared.remove(func);
  }

  static setTimeout(cb: () => void, time: number) {
    let elapsed = 0;
    const func = () => {
      elapsed += ticker.deltaMS;
      if (elapsed >= time) {
        cb();
        Ticker.shared.remove(func);
      }
    };
    const ticker = Ticker.shared.add(func);
  }
}

export { Utils };
