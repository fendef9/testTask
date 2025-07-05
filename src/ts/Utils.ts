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

  static random(min: number, max: number): number {
    let rand = min + Math.random() * (max + 1 - min);
    return rand;
  }

  static randomExclude(min: number, max: number, exclude: number) {
    if (exclude < min || exclude > max) {
      return Math.floor(Utils.random(min, max));
    }

    const n = max - min + 1;
    if (n <= 1) {
      throw new Error("Range is to short to exclude a number");
    }

    const r = Math.floor(Math.random() * (n - 1));

    return r + min >= exclude ? r + min + 1 : r + min;
  }
}

export { Utils };
