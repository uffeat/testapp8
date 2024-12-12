/* Factory with enhanced featues for managing event handlers and for 
dispatching events. */
export const events = (parent, config, ...factories) => {
  const cls = class Events extends parent {
    static PREFIX = '__'

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

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Register event handlers */
      Object.entries(updates)
        .filter(
          ([key, value]) =>
            value !== undefined && key.startsWith(Events.PREFIX)
        )
        .map(([key, value]) => [key.slice(Events.PREFIX.length), value])
        .forEach(([key, value]) => (this.on[key] = value));
      return this;
    }
  };
  return cls;
};
