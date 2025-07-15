/*
import append from "@/rollocomponent/mixins/append.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "append";

    /* Appends children. Chainable. */
    append(...children) {
      super.append(...children);
      return this;
    }

    /* Prepends children. Chainable. */
    prepend(...children) {
      super.prepend(...children);
      return this;
    }
  };
};
