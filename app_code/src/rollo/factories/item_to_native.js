import { check_factories } from "rollo/utils/check_factories";
import { items } from "rollo/factories/__factories__";

/* Factory that updates natives from NATIVE-prefixed state. */
export const item_to_native = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([items], factories);

  const cls = class ItemToNative extends parent {
    static PREFIX = '$'

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      /* Set up automatic update from ItemToNative.PREFIX-prefixed state */
      this.effects.add((changes) =>
        this.update(
          Object.fromEntries(
            Object.entries(changes)
              .filter(
                ([key, value]) =>
                  typeof key === "string" && key.startsWith(ItemToNative.PREFIX)
              )
              .map(([key, value]) => [
                key.slice(ItemToNative.PREFIX.length),
                value,
              ])
          )
        )
      );
    }
  };
  return cls;
};
