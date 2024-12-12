import { constants } from "rollo/constants";
import { check_factories } from "rollo/utils/check_factories";
import { items } from "rollo/factories/__factories__";

/* Factory that updates natives from NATIVE-prefixed state. */
export const item_to_native = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([items], factories);

  const cls = class ItemToNative extends parent {
    constructor() {
      super();
    }

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      /* Set up automatic update from NATIVE-prefixed state */
      this.items.effects.add((changes) => {
        const updates = {};
        for (const [key, value] of Object.entries(changes)) {
          if (typeof key === 'string' && key.startsWith(constants.NATIVE)) {
            updates[key.slice(constants.NATIVE.length)] = value;
          }
        }
        this.update(updates);
      });
    }
  };
  return cls;
};
