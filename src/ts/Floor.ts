import { Graphics, Container, Text } from "pixi.js";
import { HumanSpawner } from "./HumanSpawner";

interface FloorObj {
  x: number;
  y: number;
  floorCurrent: number;
  lineColor: number;
  floorLength: number;
  lineWidth: number;
  textDisplacementRight: number;
  textDisplacementDown: number;
}

class Floor {
  constructor(floorObj: FloorObj) {
    this.lineWidth = floorObj.lineWidth;
    this.x = floorObj.x;
    this.y = floorObj.y;
    this.floorCurrent = floorObj.floorCurrent;
    this.lineColor = floorObj.lineColor;
    this.floorLength = floorObj.floorLength;
    this.textDisplacementRight = floorObj.textDisplacementRight;
    this.textDisplacementDown = floorObj.textDisplacementDown;
    this.graphics = new Graphics();
    this.text = new Text({ text: `Level ${this.floorCurrent}` });
    this.container = new Container();
    Floor.instances.push(this);
  }

  private lineWidth;
  private textDisplacementRight;
  private textDisplacementDown;
  private x;
  private y;
  private floorCurrent;
  private container;
  private text;
  private graphics;
  private lineColor;
  private floorLength;
  private _humanSpawner: HumanSpawner | null = null;
  static instances: Floor[] = [];

  static wipe() {
    Floor.instances.forEach((v) => v.delete());
  }

  delete() {
    this.container?.destroy({ children: true });
  }

  set humanSpawner(value: HumanSpawner | null) {
    this._humanSpawner = value;
  }

  init() {
    this.graphics
      .moveTo(this.x, this.y)
      .lineTo(this.floorLength, this.y)
      .stroke({ width: this.lineWidth, color: this.lineColor });

    this.text.position.set(this.textDisplacementRight, this.y + this.textDisplacementDown);

    if (!this._humanSpawner) this.container.addChild(this.graphics, this.text);
    else this.container.addChild(this.graphics, this.text, this._humanSpawner.init());

    this.container.label = `Floor: ${this.floorCurrent}`;

    return this.container;
  }
}

export { Floor };
