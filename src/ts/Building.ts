import { Container, Graphics, Text } from "./PixiExtention";

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
      graphics
        .moveTo(this.elevatorShaft, a)
        .lineTo(this.floorWidth, a)
        .stroke({ width: this.lineWidth, color: this.lineColor });

      const t = new Text({ text: `Level ${i}` });
      // t.pivot.set(t.width / 2 - 90, t.height / 2 - 35)
      t.position.set(this.textDisplacementRight, a + this.textDisplacementDown);
      container.addChild(t);

      a += this.floorHeight;
    }

    // const mask = new Graphics();

    // mask.rect(-2, -2, this.floorWidth + 5, this.floorsCount * this.floorHeight + 5).fill();

    container.addChild(graphics) //, mask);
    // container.mask = mask;

    return container;
  }
}

export { Building };
