import { Data } from "rollo/utils/data";

/* Factory with batch update of properties. */
export const properties = (parent, config, ...factories) => {
  const cls = class Properties extends parent {
    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Updates properties */
      Data.create(updates)
        /* Allow update of non-standard for keys with'_'-prefix. */
        .filter(
          ([k, v]) => k in this || (typeof k === "string" && k.startsWith("_"))
        )
        .forEach(([k, v]) => (this[k] = v));
      return this;
    }
  };
  return cls;
};
