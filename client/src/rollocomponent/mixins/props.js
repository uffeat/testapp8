/*
import props from "@/rollocomponent/mixins/props.js";
20250530
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(
          ([k, v]) =>
            (!k.startsWith("__") && k in this || !k.startsWith("__") && (k.startsWith("_"))) &&
            this[k] !== v
        )
        .forEach(([k, v]) => this[k] = (typeof v === 'function') ? v.call(this, this) : v);
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
