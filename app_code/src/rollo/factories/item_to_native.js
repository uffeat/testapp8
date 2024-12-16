import { Data } from "rollo/types/data";
import { Component } from "rollo/component";
import { items } from "rollo/factories/__factories__";

/* Factory that updates natives from NATIVE-prefixed state. */
export const item_to_native = (parent, config, ...factories) => {
  /* Check factory dependencies */
  Component.factories.check([items], factories);

  const cls = class ItemToNative extends parent {
    static PREFIX = "$";

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      /* Set up automatic update from ItemToNative.PREFIX-prefixed state */
      this.effects.add((changes) =>
        this.update(
          Data.create(changes)
            .filter(
              ([k, v]) =>
                typeof k === "string" && k.startsWith(ItemToNative.PREFIX)
            )
            .map(([k, v]) => [k.slice(ItemToNative.PREFIX.length), v])
        )
      );
    }
  };
  return cls;
};
