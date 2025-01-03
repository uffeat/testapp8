
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

    /* Returns effects controller. */
    get effects() {
      return this.items.effects;
    }

    /* Returns reactive state instance. */
    get items() {
      return this.#items;
    }
    #items = new State(this);

    
  };
  return cls;
};
