/*
import shadow from "@/rollocomponent/mixins/shadow.js";
const shadow = await use("@/rollocomponent/mixins/shadow.js");
20250608
v.1.1
*/
import { Shadow } from "@/rollocomponent/tools/shadow.js";

export default (parent, config) => {
  return class extends parent {
    static __name__ = "shadow";

    #_ = {};

    constructor() {
      super();
      this.#_.shadow = Shadow(this);
    }

    get shadow() {
      return this.#_.shadow;
    }

    append(...children) {
      this.#check(...children);
      super.append(...children);
      return this;
    }

    prepend(...children) {
      this.#check(...children);
      super.prepend(...children);
      return this;
    }

    /* Checks slots */
    #check(...children) {
      children.forEach((child) => {
        if (!this.shadow.slots.has(child.slot)) {
          if (child.slot) {
            throw new Error(`No default slot.`);
          } else {
            throw new Error(`Invalid slot: ${child.slot}.`);
          }
        }
      });
    }
  };
};
