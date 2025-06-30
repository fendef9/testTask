import "./formEventManager";
import { OnApplay } from "./OnApplay";
// import { Tween, Easing } from "@tweenjs/tween.js";
import { Container } from "pixi.js";
import { App as app } from "./AppSingleton";
import { initDevtools } from "@pixi/devtools";
import { Building } from "./Building";
import { Human } from "./Human";

const program = async () => {
  const container = new Container();
  // const graphics = new Graphics();
  let b = new Building();

  OnApplay.callback = (liftCapacity, floorsCount) => {
    // b = new Building({ floorsCount });
    // container.removeChildren();
    // container.addChild(b.draw());
    console.log(liftCapacity, floorsCount);
    human.go();
  };

  initDevtools({ app });
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
  var human = new Human({
    floorCurrent: 4,
    floorDesired: 2,
    x: 900,
    y: 35,
    moveTo: 100,
  });
  human.init();
  const aa = b.draw();
  aa.addChild(human.init());

  container.addChild(aa);
  container.x = 100;
  container.y = 100;
  app.stage.addChild(container);
};

program();
