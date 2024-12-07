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
      Object.entries(updates)
        .filter(([key, value]) => key in this || key.startsWith("_"))
        .forEach(([key, value]) => (this[key] = value));
      return this;
    }
  };
  return cls;
};
