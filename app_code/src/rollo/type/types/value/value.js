import { type } from "rollo/type/type";
import { __owner__ } from "rollo/type/factories/__owner__";
import { condition } from "rollo/type/types/data/factories/condition";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { bind } from "rollo/type/types/value/factories/bind";
import { subscriptions } from "rollo/type/types/value/factories/subscriptions";
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
    subscriptions,
    transformer,
    value
  );

  class Value extends composition {
    static create = (current, update = {}) => {
      const instance = new Value();
      if (current) {
        instance.current = current;
      }
      for (const [k, v] of Object.entries(update)) {
        if (k.startsWith("_")) {
          this[k] = v;
          continue;
        }
        if (!(k in this)) {
          throw new Error(`Invalid key: ${k}`);
        }
        this[k] = v;
      }
      return instance;
    };

    constructor() {
      super();
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
