import { check_factories } from "rollo/utils/check_factories";
import { events, items } from "rollo/factories/__factories__";

/* Factory that updates natives from NATIVE-prefixed state. */
export const item_to_event = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([events, items], factories);

  const cls = class ItemToEvent extends parent {
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
      /* Send event on state change */
      this.effects.add((changes, previous) => {
        this.send("state_change", {
          detail: { changes, previous },
        });
      });
    }
  };
  return cls;
};