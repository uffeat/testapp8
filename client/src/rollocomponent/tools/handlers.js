/*
import { Handlers } from "@/rollocomponent/tools/handlers.js";
20250605
v.1.0
*/

export class Handlers {
  #_ = {};

  constructor(owner) {
    this.#_.owner = owner;

    this.#_.on = new Proxy(this, {
        get(target, type) {
          throw new Error(`'on' is write-only.`);
        },
        set(target, key, handler) {
          target.add({ [key]: handler });
          return true;
        },
      });
  }

  /* Adds event handler with `on.type = handler`-syntax. */
    get on() {
      return this.#_.on;
    }

  add(spec = {}) {
    Object.entries(spec).forEach(([key, handler]) => {
      const [type, ...dirs] = key.split("$");
      if (dirs.includes("once")) {
        const original = handler;
        handler = function wrapper(event) {
          original.call(this.#_.owner, event);
          this.#_.owner.removeEventListener(type, wrapper);
        };
      }

      this.#_.owner.addEventListener(type, handler);

      if (dirs.includes("run")) {
        handler({ target: this.#_.owner });
      }
    });
    return this.#_.owner;
  }

  remove(spec = {}) {
    Object.entries(spec).forEach(([type, handler]) => {
      this.#_.owner.removeEventListener(type, handler);
    });
    return this.#_.owner;
  }
}
