/* Factory with enhanced featues for managing event handlers and for 
dispatching events. */
export const events = (parent, config, ...factories) => {
  const cls = class Events extends parent {
    static PREFIX = "on_";

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

    /* Register and returns event handler. Option to run handler immediately.
    Useful, when 
    - handler is a fe and is needed for future dereg, and/or
    - immediate handler call is handy. */
    add_event_handler(type, handler, run = false) {
      this.addEventListener(type, handler);
      if (run) {
        handler(null)
      }
      return handler
    }

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
    update(updates) {
      super.update && super.update(updates);
      /* Register event handlers */
      Object.entries(updates)
        .filter(
          ([k, v]) =>
            v !== undefined &&
            typeof k === "string" &&
            k.startsWith(Events.PREFIX)
        )
        .map(([k, v]) => [k.slice(Events.PREFIX.length), v])
        .forEach(([k, v]) => (this.on[k] = v));
      return this;
    }
  };
  return cls;
};
