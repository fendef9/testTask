import { Container, Graphics } from "pixi.js";
import { HumanSpawner } from "./HumanSpawner";
import { Floor } from "./Floor";

interface BuildingObj {
  floorsCount: number;
  floorHeight?: number;
  floorWidth?: number;
  lineColor?: number;
  elevatorShaft?: number;
  lineWidth?: number;
  textDisplacementRight?: number;
  textDisplacementDown?: number;
}

class Building {
  constructor(buildingObj: BuildingObj = {} as BuildingObj) {
    this.floorsCount = buildingObj.floorsCount ?? 4;
    this.floorHeight = buildingObj.floorHeight ?? 70;
    this.floorWidth = buildingObj.floorWidth ?? 800;
    this.lineColor = buildingObj.lineColor ?? 0xfeeb77;
    this.elevatorShaft = buildingObj.elevatorShaft ?? 80;
    this.lineWidth = buildingObj.lineWidth ?? 5;
    this.textDisplacementRight = buildingObj.textDisplacementRight ?? 650;
    this.textDisplacementDown = buildingObj.textDisplacementDown ?? 35;
  }

  floorsCount;
  floorHeight;
  floorWidth;
  lineColor;
  elevatorShaft;
  lineWidth;
  textDisplacementRight;
  textDisplacementDown;

  draw() {
    const container = new Container();
    const graphics = new Graphics();

    graphics
      .rect(0, 0, this.floorWidth, this.floorsCount * this.floorHeight)
      .stroke({ width: 5, color: this.lineColor });

    let a = 0;
    for (let i = this.floorsCount; i >= 1; i--) {
      const spawner = new HumanSpawner({
        floorsTotal: this.floorsCount,
        floorCurrent: i,
        x: 900,
        y: a + 40,
        moveTo: -800,
      });

      const floor = new Floor({
        x: this.elevatorShaft,
        y: a,
        floorCurrent: i,
        lineColor: this.lineColor,
        floorLength: this.floorWidth,
        lineWidth: this.lineWidth,
        textDisplacementDown: this.textDisplacementDown,
        textDisplacementRight: this.textDisplacementRight,
      });
      
      floor.humanSpawner = spawner;
      container.addChild(floor.init());

      a += this.floorHeight;
    }

    const mask = new Graphics();
    mask.rect(-2, -2, this.floorWidth + 5, this.floorsCount * this.floorHeight + 5).fill();

    container.addChild(graphics, mask);
    container.mask = mask;

    return container;
  }
}

export { Building };
