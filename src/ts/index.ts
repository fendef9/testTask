import "./formEventManager";
import "./PixiExtention";
import { OnApplay } from "./OnApplay";
import { Container, Application } from "pixi.js";
// import { initDevtools } from "@pixi/devtools";
import { Building } from "./Building";
// import { Human } from "./Human";
// import { Utils } from "./utils";

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

  
  const aa = b.draw();
  container.addChild(aa);
  container.x = 100;
  container.y = 100;
  app.stage.addChild(container);
  
};

program();
