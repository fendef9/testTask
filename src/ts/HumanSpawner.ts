import { Container } from "./PixiExtention";
import { Human } from "./Human";

class HumanSpawner {
  x = 100;
  y = 35;
  container = new Container();

  init() {
    this.container.label = "Humans";
    this.spawn();
    this.container.x = this.x;
    this.container.y = this.y;
    return this.container;
  }

  random(min: number, max: number): number {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  spawn() {
    setInterval(
      () => {
        const human = new Human({
          floorCurrent: 3,
          floorDesired: 4,
          x: this.x,
          y: this.y,
          moveTo: 100,
          humanId: 1,
        });

        this.container.addChild(human.init());
        human.go();
      },
      this.random(4, 10) * 1000,
    );
  }
}

export { HumanSpawner };
