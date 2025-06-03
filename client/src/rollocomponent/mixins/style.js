/*
import style from "@/rollocomponent/mixins/style.js";
20250530
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    /* Updates style props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      for (let [key, value] of Object.entries(updates)) {
        /* Ignore undefined value to, e.g., for efficient use of iife's */
        if (value === undefined) {
          continue;
        }
        /* Ignore non-style prop key */
        if (!(key in this.style)) {
          continue;
        }
        /* Handle function values */
        if (typeof value === "function") {
          const result = value.call(this, key);
          if (result !== undefined) {
            value = result;
          }
        }
        /* Ignore no change */
        if (this.style[key] === value) {
          continue;
        }
        /* Update */
        this.style[key] = value;
      }

      return this;
    }
  };
};

/* TODO
- If ever needed: Relatively easy to store style props (current and previous) in 
  custom registry. This could track changes and only make updates, if actual 
  change. Could also be a step towards component serialization/deserialization.
- If ever needed: Relatively easy to make style props reactive, by event 
  dispatch. */
