import { constants } from "rollo/constants";
import { check_factories } from "rollo/utils/check_factories";
import { attribute, reactive } from "rollo/factories/__factories__";

/* Factory that shows state as attribute. */
export const state_to_attribute = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, reactive], factories);

  const cls = class StateToAttribute extends parent {
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
      this.effects.add((data) => {
        for (let [key, { current, previous }] of Object.entries(data)) {
          if (typeof key === 'string' && key.startsWith(constants.NATIVE)) {
            continue;
          }
          key = `state-${key}`;
          if (["boolean", "number", "string"].includes(typeof current)) {
            this.attribute[key] = current;
          } else {
            this.attribute[key] = null;
          }
        }
      });
    }
  };
  return cls;
};
