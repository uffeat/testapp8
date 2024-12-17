import { Data } from "rollo/types/data";


/* Factory with reactive items composition. */
export const items_update = (parent, config, ...factories) => {
  const cls = class ItemsUpdate extends parent {
    static PREFIX = "$";

    

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates) {
      super.update && super.update(updates);
      /* Update state */
      this.items.update(
        Data.create(updates)
          .filter(
            ([key, value]) =>
              typeof key === "string" && key.startsWith(ItemsUpdate.PREFIX)
          )
          .map(([key, value]) => [key.slice(ItemsUpdate.PREFIX.length), value])
      );
      return this;
    }
  };
  return cls;
};
