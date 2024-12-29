import "rollo/type/types/data/data";
import { type } from "@/rollo/type/type/type";
import { Message } from "rollo/type/types/state/tools/message";
import { Effects } from "rollo/type/types/state/tools/effects";

/* . */
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    /* Returns non-defined state items.
    NOTE 
    - Can, but should generally not, be mutated. */
    get current() {
      return type
        .create("data", { ...this })
        .filter(([k, v]) => !this.__chain__.defined.has(k));
    }

    /* Returns non-defined state items as-was before most recent change.
    NOTE 
    - Can, but should generally not, be mutated outside the update class. */
    get previous() {
      return this.#previous;
    }
    #previous = type.create("data");

    /* Updates state from provided object. Chainable. */
    update(update) {
      if (!update) return this;
      update = type.create("data", update);


      /* Infer changed items */
      const current = type.create(
        "data",
        update.filter(([k, v]) => this[k] !== v)
      );


      /* Infer changed items as they were before change */
      const previous = type.create(
        "data",
        current.entries.map(([k, v]) => [k, this.previous[k]])
      );


      /* Update */
      current.forEach(([k, v]) => {
        this.previous[k] = this[k];
        /* NOTE undefined deletes. This is critical for other methods! */
        if (v === undefined) {
          delete this[k];
        } else {
          this[k] = v;
        }
      });

      
      /* Notify effects */
      if (current.size) {
        this.effects.notify(Message.create({ current, previous, owner: this }));
      }
      return this;
    }

    /* Returns controller for managing effects. */
    get effects() {
      return this.#effects;
    }
    #effects = new Effects(this);
  };
};
