/*
import handlers from "@/rollocomponent/mixins/handlers.js";
20250527
v.1.0
*/

import { Handlers } from "@/rollocomponent/tools/handlers.js";

/* TODO
- If ever needed: Relatively easy to register handlers in custom registry. 
  This would allow introspection and type-based clearing. */

export default (parent, config) => {
  return class extends parent {
    #_ = {};

    constructor() {
      super();

      this.#_.handlers = new Handlers(this);
    }

    /* Returns controller for managing event handlers. */
    get handlers() {
      return this.#_.handlers;
    }

    /* Adds event handler with `on.type = handler`-syntax. */
    get on() {
      return this.#_.handlers.on;
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
