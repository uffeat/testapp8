import { constants } from "rollo/constants";
import { state } from "rollo/factories/state";

/* Factory with reactive items composition. */
export const items = (parent, config, ...factories) => {
  const cls = class Items extends parent {
    

    get $() {
      return this.#items.$;
    }

    get effects() {
      return this.#items.effects;
    }

    get items() {
      return this.#items;
    }
    #items = new (state(class {}))(this);

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Update state */
      this.#items.update(
        Object.fromEntries(
          Object.entries(updates)
            .filter(
              ([key, value]) =>
                typeof key === "string" && key.startsWith(constants.STATE)
            )
            .map(([key, value]) => [key.slice(constants.STATE.length), value])
        )
      );
      return this;
    }
  };
  return cls;
};
