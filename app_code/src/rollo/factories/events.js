import { constants } from "rollo/constants";

/* Factory for all web components. */
export const events = (parent, config, ...factories) => {
  const cls = class Events extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Syntactic sugar for event handler registration. */
    get on() {
      return this.#on;
    }
    #on = new Proxy(this, {
      get() {
        throw new Error(`'on' is write-only.`);
      },
      set(target, type, handler) {
        if (handler === undefined) return true;
        target.addEventListener(type, handler);
        return true;
      },
    });

    /* Dispatches custom event and returns detail. */
    send(type, { detail, ...options } = {}) {
      this.dispatchEvent(new CustomEvent(type, { detail, ...options }));
      /* NOTE If detail is mutable, it's handy to get it back, 
      since handler may have mutated it. This enables two-way communication 
      between event target and handler. */
      return detail;
    }

    update(updates = {}) {
      super.update && super.update(updates);
      Object.entries(updates)
        .filter(
          ([key, value]) =>
            value !== undefined && key.startsWith(constants.HANDLER)
        )
        .map(([key, value]) => [key.slice(constants.HANDLER.length), value])
        .forEach(([key, value]) => (this.on[key] = value));
    }
  };
  return cls;
};
