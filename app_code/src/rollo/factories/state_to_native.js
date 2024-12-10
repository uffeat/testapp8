import { constants } from "rollo/constants";
import { check_factories } from "rollo/utils/check_factories";
import { reactive } from "rollo/factories/__factories__";

/* Factory that updates natives from NATIVE-prefixed state. */
export const state_to_native = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([reactive], factories);

  const cls = class StateToNative extends parent {
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
      this.effects.add((data) => {
        const updates = {};
        for (const [key, { current, previous }] of Object.entries(data)) {
          if (key && key.startsWith(constants.NATIVE)) {
            updates[key.slice(constants.NATIVE.length)] = current;
          }
        }
        this.update(updates);
      });
    }
  };
  return cls;
};
