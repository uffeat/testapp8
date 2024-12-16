import { Data } from "rollo/utils/data";
import { State } from "rollo/factories/state";

/* Factory with reactive items composition. */
export const items = (parent, config, ...factories) => {
  const cls = class Items extends parent {
    static PREFIX = "$";

    /* NOTE
    While it can be OK to access state directly outside the component, 
    it's often cleaner to let outside-code access state via specific
    props that mirror given state items.
    */

    /* Provives API for getting/setting single state items. */
    get $() {
      return this.#items.$;
    }

    get effects() {
      return this.#items.effects;
    }

    get items() {
      return this.#items;
    }
    #items = new State(this);

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
              typeof key === "string" && key.startsWith(Items.PREFIX)
          )
          .map(([key, value]) => [key.slice(Items.PREFIX.length), value])
      );
      return this;
    }
  };
  return cls;
};
