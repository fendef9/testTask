import { Container, Graphics, Text, Application } from "pixi.js";

declare module "pixi.js" {
  interface Container {
    script?: object;
    getContainerBylabel(label: string): Container | null;
    getContainerBylabel(cb: (label: string) => boolean): Container | null;
  }
}

Container.prototype.getContainerBylabel = function (
  labelOrCb: string | ((label: string) => boolean),
): Container | null {
  let root: Container = this;

  while (root.parent) {
    root = root.parent;
  }

  function recursionSearch(container: Container): Container | null {
    let check: boolean = false;
    const l = container.label;

    if (typeof labelOrCb === "string") check = l === labelOrCb;
    else if (typeof labelOrCb === "function") check = labelOrCb(l);

    if (check) return container;

    for (const child of container.children) {
      if (child instanceof Container) {
        const found: Container | null = recursionSearch(child);
        if (found) return found;
      }
    }
    return null;
  }
  return recursionSearch(root);
};

export { Container, Graphics, Text, Application };
