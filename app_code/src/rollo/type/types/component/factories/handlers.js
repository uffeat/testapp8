export const handlers = (parent, config, ...factories) => {
  const ON = config.ON;

  return class extends parent {
    static name = "handlers";

    #handlers = new Handlers(this);

    /* Returns handlers controller. */
    get handlers() {
      return this.#handlers;
    }

    /* Syntactic sugar for event handler registration. */
    get on() {
      return this.#on;
    }
    #on = new Proxy(this, {
      get(target, type) {
        return target.handlers.handlers(type);
      },
      set(target, type, handler) {
        target.handlers.add(type, handler);
        return true;
      },
    });

    /* Adds event handlers from 'on_'-syntax. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);
      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(ON) && typeof v === "function")
        .forEach(([k, v]) => (this.on[k.slice(ON.length)] = v));
      return this;
    }
  };
};

class Handlers {
  #owner;
  #registry = new Map();

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner component. */
  get owner() {
    return this.#owner;
  }

  get registry() {
    return this.#registry;
  }

  get types() {
    return [...this.registry.keys()];
  }

  add(type, handler, run = false) {
    if (type === undefined) return;
    if (handler === undefined) return;
    let registry = this.registry.get(type);
    if (!registry) {
      registry = new Set();
      this.registry.set(type, registry);
    }
    if (!registry.has(handler)) {
      registry.add(handler);
      this.owner.addEventListener(type, handler);
    }
    if (run) {
      handler.call(this.owner);
    }
    return handler;
  }

  clear(type) {
    if (type) {
      const registry = this.registry.get(type);
      if (registry) {
        for (const handler of registry.values()) {
          this.owner.removeEventListener(type, handler);
        }
        registry.clear();
        this.registry.delete(registry);
      }
    } else {
      this.types.forEach((type) => this.clear(type));
    }
  }

  handlers(type) {
    const registry = this.registry.get(type);
    if (registry) {
      return [...registry.values()];
    }
    return [];
  }

  has(type, handler) {
    const registry = this.registry.get(type);
    if (registry) {
      return registry.has(handler);
    }
    return false;
  }

  remove(type, handler) {
    if (type === undefined) return;
    if (handler === undefined) return;
    const registry = this.registry.get(type);
    if (registry.has(handler)) {
      registry.delete(handler);
      this.owner.removeEventListener(type, handler);
    }
    if (!registry.size) {
      this.registry.delete(registry);
    }
  }

  /* Returns number of registered of handlers for a given type. */
  size(type) {
    if (type) {
      const registry = this.registry.get(type);
      if (registry) {
        return registry.size;
      }
      return 0;
    } else {
      let size = 0
      for (const registry of this.registry.values()) {
        size += registry.size
      }
      return size
    }
  }
}
