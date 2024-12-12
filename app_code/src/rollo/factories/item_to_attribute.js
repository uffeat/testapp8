import { constants } from "rollo/constants";
import { check_factories } from "rollo/utils/check_factories";
import { attribute, items } from "rollo/factories/__factories__";

/* Factory that shows state as attribute. */
export const item_to_attribute = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, items], factories);

  const cls = class ItemToAttribute extends parent {
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
      /* Show state as attribute */
      this.items.effects.add((changes) => {
        for (let [key, value] of Object.entries(changes)) {
          if (typeof key === 'string' && key.startsWith(constants.NATIVE)) {
            continue;
          }
          key = `state-${key}`;
          if (["boolean", "number", "string"].includes(typeof value)) {
            this.attribute[key] = value;
          } else {
            this.attribute[key] = null;
          }
        }
      });
    }
  };
  return cls;
};
