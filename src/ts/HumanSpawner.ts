import { Container, Graphics, Ticker } from "pixi.js";
import { Human } from "./Human";
import { Utils } from "./Utils";

interface HumanSpawnerObj {
  floorsTotal: number;
  floorCurrent: number;
  x: number;
  y: number;
  moveTo: number;
  humanWidth: number;
  humanHeight: number;
}

class HumanSpawner {
  constructor(humanSpawnerObj: HumanSpawnerObj) {
    this.floorsTotal = humanSpawnerObj.floorsTotal;
    this.floorCurrent = humanSpawnerObj.floorCurrent;
    this.x = humanSpawnerObj.x;
    this.y = humanSpawnerObj.y;
    this.humanWidth = humanSpawnerObj.humanWidth;
    this.humanHeight = humanSpawnerObj.humanHeight;
    this.moveTo = humanSpawnerObj.moveTo;
  }

  private moveTo;
  private floorsTotal;
  private floorCurrent;
  private x;
  private y;
  private humanWidth;
  private humanHeight;
  private minSpawnTime = 4; // in seconds
  private maxSpawnTime = 10; // in seconds
  private container = new Container();
  private timer: null | (() => Ticker) = null;

  init() {
    this.container.label = "Humans";
    this.container.x = this.x;
    this.container.y = this.y;
    this.spawn();
    /////////////////// debug ///////////////////////////////
    const g = new Graphics();
    g.rect(0, 0, 10, 10).fill({ color: 0x0ffffff });
    this.container.addChild(g);

    /////////////////////////////////////////////
    return this.container;
  }

  random(min: number, max: number): number {
    let rand = min + Math.random() * (max + 1 - min);
    return rand;
  }

  randomExclude(min: number, max: number, exclude: number) {
    if (exclude < min || exclude > max) {
      return Math.floor(this.random(min, max));
    }

    const n = max - min + 1;
    if (n <= 1) {
      throw new Error("Range is to short to exclude a number");
    }

    const r = Math.floor(Math.random() * (n - 1));

    return r + min >= exclude ? r + min + 1 : r + min;
  }

  spawn() {
    this.timer = Utils.setInterval(
      () => {
        const human = new Human({
          floorCurrent: this.floorCurrent,
          floorDesired: this.randomExclude(1, this.floorsTotal, this.floorCurrent),
          x: 0,
          y: 0,
          moveTo: this.moveTo,
          humanWidth: this.humanWidth,
          humanHeight: this.humanHeight,
        });

        this.container.addChild(human.init());
      },
      this.random(this.minSpawnTime, this.maxSpawnTime) * 1000,
    );
  }

  stopSpawn() {
    this.timer?.();
  }
}

export { HumanSpawner };
