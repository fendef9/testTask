import "./formEventManager";
import "./PixiExtention";
import { OnApplay } from "./OnApplay";
import { Container, Application } from "pixi.js";
// import { initDevtools } from "@pixi/devtools";
import { Building } from "./Building";
import { Human } from "./Human";
import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { Observer } from "./EventObserver";
// import { Human } from "./Human";
// import { Utils } from "./utils";

const program = async () => {
  const app = new Application();
  const container = new Container();
  let building = new Building();

  OnApplay.callback = (liftCapacity, floorsCount) => {
    container.removeChildren();
    Building.wipe();
    Human.wipe();
    Elevator.wipe();
    Floor.wipe();
    Observer.whipe();

    building = new Building({ floorsCount: floorsCount, elevatorCapacity: liftCapacity });
    container.addChild(building.draw());
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
