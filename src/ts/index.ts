import "./formEventManager";
import { OnApplay } from "./OnApplay";
import { Container, Application } from "pixi.js";
// import { initDevtools } from "@pixi/devtools";
import { Building } from "./Building";
// import { Human } from "./Human";
// import { Utils } from "./utils";
import { HumanSpawner } from "./HumanSpawner";

const program = async () => {
  const app = new Application();
  const container = new Container();
  // const graphics = new Graphics();
  let b = new Building();

  OnApplay.callback = (liftCapacity, floorsCount) => {
    b = new Building({ floorsCount });
    container.removeChildren();
    container.addChild(b.draw());
    console.log(liftCapacity, floorsCount);
  };

  // initDevtools({ app });
  await app.init({ background: "#1099bb", resizeTo: window });
  document.body.appendChild(app.canvas);

  //////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // graphics
  //   .moveTo(10, 10)
  //   .lineTo(70, 10)
  //   .lineTo(70, 15)
  //   .moveTo(70, 65)
  //   .lineTo(70, 70)
  //   .lineTo(10, 70)
  //   .lineTo(10, 8)
  //   .stroke({ width: 5, color: 0xfeeb77 });
  // const bb = new HumanSpawner({
  //   floorsTotal: 4,
  //   floorCurrent: 2,
  //   x: 900,
  //   y: 190,
  //   moveTo: -790,
  // });

  // const bc = new HumanSpawner({
  //   floorsTotal: 4,
  //   floorCurrent: 2,
  //   x: 0,
  //   y: 190,
  //   moveTo: 790,
  // });

  // const spawner = new HumanSpawner();
  const aa = b.draw();
  // aa.addChild(bb.init());
  // aa.addChild(bc.init());
  container.addChild(aa);
  // container.addChild(spawner.init())
  container.x = 100;
  container.y = 100;
  app.stage.addChild(container);
};

program();
