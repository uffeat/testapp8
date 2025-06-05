/*
import props from "@/rollocomponent/mixins/props.js";
20250530
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "props";
    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      for (let [key, value] of Object.entries(updates)) {
        /* Ignore undefined value to, e.g., for efficient use of iife's */
        if (value === undefined) {
          continue;
        }
        /* Ignore __ key */
        if (key.startsWith("__")) {
          continue;
        }
        /* Ignore non-prop key, but allow psudo-private */
        if (!(key in this) && !key.startsWith("_")) {
          continue;
        }
        /* Handle function values */
        if (typeof value === "function" && !key.startsWith("on")) {
          const result = value.call(this, key);
          if (result !== undefined) {
            value = result;
          }
        }
        /* Ignore no change */
        if (this[key] === value) {
          continue;
        }
        /* Update */
        this[key] = value;
      }
      return this;
    }
  };
};

/* TODO
- If ever needed: Relatively easy to store props (current and previous) in 
  custom registry. This could track changes and only make updates, if actual 
  change. Could also be a step towards component serialization/deserialization.
- If ever needed: Relatively easy to make props reactive, by event 
  dispatch. */
