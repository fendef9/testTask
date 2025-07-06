import "./formEventManager";
import "./PixiExtention";
import { OnApplay } from "./OnApplay";
import { Container, Application, Ticker } from "pixi.js";
import { Building } from "./Building";
import { Human } from "./Human";
import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { Observer } from "./EventObserver";
import { HumanSpawner } from "./HumanSpawner";

const program = async () => {
  const app = new Application();
  let container = new Container();
  let building = new Building();

  OnApplay.callback = (liftCapacity, floorsCount) => {
    try {
      Ticker.shared.stop();
      Building.wipe();
      Floor.wipe();
      HumanSpawner.wipe();
      Human.wipe();
      Elevator.wipe();
      Observer.whipe();
      container.destroy({ children: true });
    } catch (error) {
      console.warn(error);
    }

    building = new Building({ floorsCount: floorsCount, elevatorCapacity: liftCapacity });
    container = new Container().addChild(building.draw());
    container.x = 100;
    container.y = 100;
    app.stage.addChild(container);
  };

  await app.init({ background: "#1099bb", resizeTo: window });
  document.body.appendChild(app.canvas);

  const b = building.draw();
  container.addChild(b);
  container.x = 100;
  container.y = 100;
  app.stage.addChild(container);
};

program();
