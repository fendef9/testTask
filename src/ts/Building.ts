import { Container, Graphics } from "pixi.js";
import { HumanSpawner } from "./HumanSpawner";
import { Floor } from "./Floor";
import { Elevator } from "./Elevator";

interface BuildingObj {
  floorsCount: number;
  floorHeight?: number;
  floorWidth?: number;
  lineColor?: number;
  elevatorShaft?: number;
  lineWidth?: number;
  textDisplacementRight?: number;
  textDisplacementDown?: number;
  elevatorCapacity?: number;
  humanWidth?: number;
  humanHeight?: number;
}

class Building {
  constructor(buildingObj: BuildingObj = {} as BuildingObj) {
    this.floorsCount = buildingObj.floorsCount ?? 4;
    this.floorHeight = buildingObj.floorHeight ?? 70;
    this.floorWidth = buildingObj.floorWidth ?? 800;
    this.lineColor = buildingObj.lineColor ?? 0xfeeb77;
    this.elevatorCapacity = buildingObj.elevatorCapacity ?? 2;
    this.elevatorShaft = buildingObj.elevatorShaft ?? 200;
    this.lineWidth = buildingObj.lineWidth ?? 5;
    this.textDisplacementRight = buildingObj.textDisplacementRight ?? this.floorWidth - 100;
    this.textDisplacementDown = buildingObj.textDisplacementDown ?? this.floorHeight - 35;
    this.displaceSpawnerFromScreen = 100;
    this.humanWidth = buildingObj.humanWidth ?? 30;
    this.humanHeight = buildingObj.humanHeight ?? 50;
    this.edgeOfFloor = -(
      this.floorWidth +
      this.displaceSpawnerFromScreen -
      this.elevatorShaft -
      20
    );
    this.container;

    Building.instances.push(this);
  }

  floorsCount;
  floorHeight;
  floorWidth;
  lineColor;
  elevatorShaft;
  lineWidth;
  textDisplacementRight;
  textDisplacementDown;
  elevatorCapacity;
  displaceSpawnerFromScreen;
  edgeOfFloor;
  humanWidth;
  humanHeight;
  container: Container | null = null;
  static instances: Building[] = [];

  static wipe() {
    Building.instances.forEach((v) => v.delete());
    Building.instances = [];
  }

  delete() {
    this.container?.destroy(true);
  }

  draw() {
    this.container = new Container();
    const graphics = new Graphics();

    graphics
      .rect(0, 0, this.floorWidth, this.floorsCount * this.floorHeight + this.lineWidth * 2)
      .stroke({ width: this.lineWidth, color: this.lineColor });

    const elevator = new Elevator({
      x: 0,
      y: 0,
      floorHeight: this.floorHeight,
      floorTotal: this.floorsCount,
      elevatorCapacity: this.elevatorCapacity,
      floorStart: 1,
      elevatorShaftWidth: this.elevatorShaft,
    });

    let a = 0;
    for (let i = this.floorsCount; i >= 1; i--) {
      const spawner = new HumanSpawner({
        floorsTotal: this.floorsCount,
        floorCurrent: i,
        x: this.floorWidth + this.displaceSpawnerFromScreen,
        y: a + this.floorHeight - this.humanHeight / 2 - 5,
        moveTo: this.edgeOfFloor,
        humanWidth: this.humanWidth,
        humanHeight: this.humanHeight,
        elevator: elevator,
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
      this.container.addChild(floor.init());

      a += this.floorHeight;
    }

    const mask = new Graphics();
    mask
      .rect(
        -3,
        -3,
        this.floorWidth + 5,
        this.floorsCount * this.floorHeight + this.lineWidth * 2 + 6,
      )
      .fill();

    this.container.label = "Building";
    this.container.addChild(graphics, mask, elevator.init());
    this.container.mask = mask;

    return this.container;
  }
}

export { Building };
