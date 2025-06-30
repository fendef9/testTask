import "./formEventManager";
import { OnApplay } from "./OnApplay";
import { Tween, Easing } from "@tweenjs/tween.js";
import { Application, Container, Graphics } from "pixi.js";
import { initDevtools } from "@pixi/devtools";

const program = async () => {
  const app = new Application();
  const container = new Container();
  const graphics = new Graphics();

  OnApplay.callback = (liftCapacity, floorsCount) => {
    alert(`Lift Capacity: ${liftCapacity}, Floors Count: ${floorsCount}`);
  };

  initDevtools({ app });

  await app.init({ background: "#1099bb", resizeTo: window });

  document.body.appendChild(app.canvas);
  app.stage.addChild(container);

  graphics
    .circle(app.screen.width / 2, app.screen.height / 2, 100)
    .fill({
      color: 0x650a5a,
      alpha: 1,
    })
    .stroke({
      width: 5,
      color: 0xfeeb77,
    });

  container.addChild(graphics);
  app.stage.addChild(container);

  // const coords = {x:0, y: 0}
  const tw = new Tween(container);
  tw.to({ x: 600 }, 2000).easing(Easing.Linear.In).yoyo(true).repeat(Infinity).start();

  app.ticker.add(() => {
    tw.update();
  });
};

program();
