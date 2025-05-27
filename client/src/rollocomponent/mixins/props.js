/*
import props from "@/rollocomponent/mixins/props.js";
20250527
v.1.0
*/

/* TODO
- If ever needed: Relatively easy to store props (current and previous) in 
  custom registry. This could track changes and only make updates, if actual 
  change. Could also be a step towards component serialization/deserialization.
- If ever needed: Relatively easy to make props reactive, by event 
  dispatch. */

export default (parent, config) => {
  return class extends parent {
    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([k, v]) => k in this || (k.startsWith("_") && !k.startsWith("__")))
        .forEach(([k, v]) => (this[k] = v));
      return this;
    }
  };
};
