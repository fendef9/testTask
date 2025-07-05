interface CustomEvents {
  animationEnds: { entityId: number };
  elevatorStopsOnFloor: { floor: number };
  elevatorGoFurther: {};
}

class EventObserver<Events extends Record<string, any>> {
  private listeners: {
    [k in keyof Events]?: Array<(payload: Events[k]) => void>;
  } = {};

  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];

    this.listeners[event].push(listener);
  }

  off<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];

    this.listeners[event].filter((l) => l !== listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.listeners[event]?.forEach((l) => l(payload));
  }

  once<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    const wrapper = (payload: Events[K]) => {
      this.off(event, wrapper);
      listener(payload);
    };
    this.on(event, wrapper);
  }
}

const Observer = new EventObserver<CustomEvents>();

export { Observer };
