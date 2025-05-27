/*
import handlers from "@/rollocomponent/mixins/handlers.js";
20250527
v.1.0
*/

/* TODO
- If ever needed: Relatively register handlers in custom registry. This would 
  allow introspection and type-based clearing. */

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.handlers = new (class {
        add(spec = {}) {
          Object.entries(spec).forEach(([key, handler]) => {
            const [type, ...dirs] = key.split("$");
            if (dirs.includes("once")) {
              const _handler = handler;
              handler = (event) => {
                _handler.call(owner, event);
                owner.handlers.remove({ [type]: handler });
              };
            }
            owner.addEventListener(type, handler);

            if (dirs.includes("run")) {
              handler({ owner });
            }
          });
          return owner;
        }

        remove(spec = {}) {
          Object.entries(spec).forEach(([type, handler]) => {
            owner.removeEventListener(type, handler);
          });
          return owner;
        }
      })();

      this.#_.on = new Proxy(this, {
        get(target, type) {
          throw new Error(`'on' is write-only.`);
        },
        set(target, key, handler) {
          target.handlers.add({ [key]: handler });
          return true;
        },
      });
    }

    /* Returns controller for managing event handler from objects. */
    get handlers() {
      return this.#_.handlers;
    }

    /* Adds event handler with `on.type = handler`-syntax. */
    get on() {
      return this.#_.on;
    }

    /* Adds event handlers from '@'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);

      this.handlers.add(
        Object.fromEntries(
          Object.entries(updates)
            .filter(([k, v]) => k.startsWith("@"))
            .map(([k, v]) => [k.slice("@".length), v])
        )
      );

      return this;
    }
  };
};
