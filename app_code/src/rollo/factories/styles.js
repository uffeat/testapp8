import { Data } from "rollo/utils/data";

/* Factory with batch update of style items. */
export const styles = (parent, config, ...factories) => {
  const cls = class Styles extends parent {
    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates) {
      super.update && super.update(updates);
      /* Updates styles */
      Data.create(updates)
        /* Avoid conflicts: No style update, if key coincides with property. */
        .filter(([k, v]) => !(k in this) && k in this.style)
        .forEach(([k, v]) => (this.style[k] = v));
      return this;
    }
  };
  return cls;
};
