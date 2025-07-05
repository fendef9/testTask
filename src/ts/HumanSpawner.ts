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
  elevator: Elevator;
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
    this.elevator = humanSpawnerObj.elevator;
  }

  private moveTo;
  private elevator;
  private floorsTotal;
  private floorCurrent;
  private x;
  private y;
  private humanWidth;
  private humanHeight;
  private minSpawnTime = 4; // in seconds
  private maxSpawnTime = 6; // in seconds
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

  spawn() {
    this.timer = Utils.setInterval(
      () => {
        const human = new Human({
          floorCurrent: this.floorCurrent,
          floorDesired: Utils.randomExclude(1, this.floorsTotal, this.floorCurrent),
          x: 0,
          y: 0,
          moveTo: this.moveTo,
          humanWidth: this.humanWidth,
          humanHeight: this.humanHeight,
          elevator: this.elevator,
        });

        this.container.addChild(human.init());
      },
      Utils.random(this.minSpawnTime, this.maxSpawnTime) * 1000,
    );
  }

  stopSpawn() {
    this.timer?.();
  }
}

export { HumanSpawner };
