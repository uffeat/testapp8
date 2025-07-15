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
        /* Ignore __ keys */
        if (key.startsWith("__")) {
          continue;
        }
        /* Ignore non-prop keys, but allow psudo-private */
        if (!(key in this) && !key.startsWith("_")) {
          continue;
        }
        /* Ignore undefined value to, e.g., for efficient use of iife's */
        if (value === undefined) {
          continue;
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
