import "./formEventManager";
import { OnApplay } from "./OnApplay";
import { Container } from "./PixiExtention";
import { App as app } from "./AppSingleton";
// import { initDevtools } from "@pixi/devtools";
import { Building } from "./Building";
import { Human } from "./Human";
// import { HumanSpawner } from "./HumanSpawner";

const program = async () => {
  const container = new Container();
  // const graphics = new Graphics();
  let b = new Building();

  OnApplay.callback = (liftCapacity, floorsCount) => {
    // b = new Building({ floorsCount });
    // container.removeChildren();
    // container.addChild(b.draw());
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
  var human = new Human({
    floorCurrent: 4,
    floorDesired: 2,
    x: 900,
    y: 35,
    moveTo: 100,
    humanId: 1,
  });

  
  setTimeout(() => {
    var human1 = new Human({
    floorCurrent: 2,
    floorDesired: 4,
    x: 900,
    y: 35,
    moveTo: 100,
    humanId: 2,
  });

    aa.addChild(human1.init());
    human1.go();
  }, 5000);

  
  setTimeout(() => {
    var human2 = new Human({
    floorCurrent: 1,
    floorDesired: 5,
    x: 900,
    y: 35,
    moveTo: 100,
    humanId: 3,
  });

    aa.addChild(human2.init());
    human2.go();
  }, 10000);
  // const spawner = new HumanSpawner();
  const aa = b.draw();
  aa.addChild(human.init());
  human.go();
  aa.label = "Humans"
  container.addChild(aa);
  // container.addChild(spawner.init())
  container.x = 100;
  container.y = 100;
  app.stage.addChild(container);
  console.log(container.getContainerBylabel("Human: 1")?.label);
};

program();
