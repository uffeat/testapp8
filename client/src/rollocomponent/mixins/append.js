/*
import append from "@/rollocomponent/mixins/append.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    /* Appends children. Chainable. */
    append(...children) {
      super.append(...children);
      return this;
    }
  };
};
