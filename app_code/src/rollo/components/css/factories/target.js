import { check_factories } from "rollo/utils/check_factories";
import { connected, items } from "rollo/factories/__factories__";

/* Factory for target prop. */
export const target = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([connected, items], factories);
  const cls = class Target extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      /* Add effect to set target from live DOM */
      this.effects.add((data) => {
        if (this.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");

      /* Add effect to check that target has rules */
      this.effects.add((changes, previous) => {
        if (this.target) {
          if (!this.target.rules) {
            throw new Error(`Target does not have rules.`);
          }
        }
      }, "target");
    }

    /* Returns target state. */
    get target() {
      return this.$.target;
    }
    /* Sets target state. */
    set target(target) {
      this.$.target = target;
    }
  };
  return cls;
};
