/* 
20250402
src/rollo/component/factories/handlers.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/handlers.js
import { handlers } from "rollo/component/factories/handlers.js";
*/

const { constants } = await modules.get("@/rollo/component/tools/constants.js");

const { ON } = constants;

export const handlers = (parent, config, ...factories) => {
  return class extends parent {
    static name = "handlers";

    #handlers;
    #on;

    constructor() {
      super();
      this.#handlers = new (class Handlers {
        #max = 5;
        #owner;
        #registry = new Map();

        constructor(owner) {
          this.#owner = owner;
        }

        /* Returns max allowed handlers per type. */
        get max() {
          return this.#max;
        }

        /* Sets max allowed handlers per type. */
        set max(max) {
          this.#max = max;
        }

        /* Returns owner component. */
        get owner() {
          return this.#owner;
        }

        /* Returns handlers registry.
        NOTE
        - Can, but should generally not, be used exteranlly. */
        get registry() {
          return this.#registry;
        }

        /* Returns array of event types, for which handlers are registered. */
        get types() {
          return [...this.registry.keys()];
        }

        /* Registers and returns handler. */
        add(type, handler, { once = false, run = false } = {}) {
          /* Protect against memory leaks */
          if (
            import.meta.env.DEV &&
            typeof this.max === "number" &&
            this.size(type) >= this.max
          ) {
            console.error(
              `Too many type '${type}' handlers registered on:`,
              this.owner
            );
          }
          if (once) {
            if (run) {
              console.warn(
                "Ignored instruction to run once-handler cannot immediately."
              );
            }
            const _handler = (event) => {
              if (_handler._ran) {
                if (typeof once === "function") {
                  once.call(this.owner);
                }
                this.owner.removeEventListener(type, _handler);
              } else {
                handler.call(this.owner, event);
                _handler._ran = true;
              }
            };
            this.owner.addEventListener(type, _handler);
          } else {
            let registry = this.registry.get(type);
            if (!registry) {
              registry = new Set();
              this.registry.set(type, registry);
            }
            if (!registry.has(handler)) {
              this.owner.addEventListener(type, handler);
              registry.add(handler);
            }

            if (run) {
              handler.call(this.owner, null);
            }
          }
          return handler;
        }

        /* Removes all handlers for a given type. Chainable with respect to owner. */
        clear(type) {
          if (type) {
            const registry = this.registry.get(type);
            if (registry) {
              for (const handler of registry.values()) {
                this.owner.removeEventListener(type, handler);
              }
              registry.clear();
              this.registry.delete(type);
            }
          } else {
            this.types.forEach((type) => this.clear(type));
          }
          return this.owner;
        }

        /* Returns array of handlers registered for a given type. */
        handlers(type) {
          const registry = this.registry.get(type);
          if (registry) {
            return [...registry.values()];
          }
          return [];
        }

        /* Tests, if handler is registered for a given type. */
        has(type, handler) {
          const registry = this.registry.get(type);
          if (registry) {
            return registry.has(handler);
          }
          return false;
        }

        /* Removes handler for a given type. Chainable with respect to owner. */
        remove(type, handler) {
          this.owner.removeEventListener(type, handler);
          const registry = this.registry.get(type);
          if (registry) {
            if (registry.has(handler)) {
              registry.delete(handler);
            }
            if (!registry.size) {
              this.registry.delete(registry);
            }
          }
          return this.owner;
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
            let size = 0;
            for (const registry of this.registry.values()) {
              size += registry.size;
            }
            return size;
          }
        }
      })(this);
      this.#on = new Proxy(this, {
        get(target, type) {
          return target.handlers.handlers(type);
        },
        set(target, type, handler) {
          target.handlers.add(type, handler);
          return true;
        },
      });
    }

    /* Returns handlers controller. */
    get handlers() {
      return this.#handlers;
    }

    /* Syntactic sugar for event handler registration. */
    get on() {
      return this.#on;
    }

    /* Adds event handlers from 'on_'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([k, v]) => k.startsWith(ON) && typeof v === "function")
        .forEach(([k, v]) => (this.on[k.slice(ON.length)] = v));
      return this;
    }
  };
};
