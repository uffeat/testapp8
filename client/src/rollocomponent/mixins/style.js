/*
import style from "@/rollocomponent/mixins/style.js";
20250527
v.1.0
*/

/* TODO
- If ever needed: Relatively easy to store style props (current and previous) in 
  custom registry. This could track changes and only make updates, if actual 
  change. Could also be a step towards component serialization/deserialization.
- If ever needed: Relatively easy to make style props reactive, by event 
  dispatch. */

export default (parent, config) => {
  return class extends parent {
    /* Updates style props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([k, v]) => k in this.style)
        .forEach(([k, v]) => (this.style[k] = v));
      return this;
    }
  };
};
