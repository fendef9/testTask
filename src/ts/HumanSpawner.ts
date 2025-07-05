import { Container, Graphics, Ticker } from "pixi.js";
import { Human } from "./Human";
import { Utils } from "./Utils";
import { Elevator } from "./Elevator";

interface HumanSpawnerObj {
  floorsTotal: number;
  floorCurrent: number;
  x: number;
  y: number;
  moveTo: number;
  humanWidth: number;
  humanHeight: number;
  elevator:Elevator
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
    this.elevator = humanSpawnerObj.elevator
  }

  private a = 0;
  private moveTo;
  private elevator
  private floorsTotal;
  private floorCurrent;
  private x;
  private y;
  private humanWidth;
  private humanHeight;
  private minSpawnTime = 1; // in seconds
  private maxSpawnTime = 2; // in seconds
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
         if(this.a > 1) return
        this.a ++;

        const human = new Human({
          floorCurrent: this.floorCurrent,
          floorDesired: this.randomExclude(1, this.floorsTotal, this.floorCurrent),
          x: 0,
          y: 0,
          moveTo: this.moveTo,
          humanWidth: this.humanWidth,
          humanHeight: this.humanHeight,
          elevator: this.elevator,
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
