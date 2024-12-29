import { type } from "rollo/type/type";
import { __owner__ } from "rollo/type/factories/__owner__";
import { condition } from "rollo/type/types/data/factories/condition";
import { freeze } from "rollo/type/types/data/factories/freeze";
import { items } from "rollo/type/types/data/factories/items";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { bind } from "rollo/type/types/value/factories/bind";
import { subscriptions } from "rollo/type/types/data/factories/subscriptions";
import { value } from "rollo/type/types/value/factories/value";

/* Reactive single-value store. 
NOTE
- Zero dependencies.
- Pure JS; does not use browser APIs.
- Relies on Vite, only for import syntax.
*/
export const Value = (() => {
  const composition = type.compose(
    Object,
    {},
    __owner__,
    bind,
    condition,
    freeze,
    items,
    subscriptions,
    transformer,
    value
  );

  class Value extends composition {
    /* Declare reactive target */
    static reactive = "current";
    static create = (...args) => new Value(...args);

    constructor(current, update = {}) {
      super();

      if (current !== undefined) {
        this.current = current;
      }
      this.update(update);
    }

    /* Returns name. */
    get name() {
      return this.#name;
    }
    /* Sets name. */
    set name(name) {
      this.#name = name;
    }
    #name;
  }

  return type.register("value", Value);
})();
