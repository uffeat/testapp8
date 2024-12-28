import { type as Type } from "rollo/type/type";
import { __name__ } from "rollo/type/factories/__name__";
import { __owner__ } from "rollo/type/factories/__owner__";
import { subscriptions } from "rollo/type/types/value/factories/subscriptions";
import { value } from "rollo/type/types/value/factories/value";


/* Reactive single-value store. 
NOTE
- Zero dependencies.
- Pure JS; does not use browser APIs.
- Relies on Vite, only for import syntax.
*/
export const Value = (() => {
  const composition = Type.compose(
    Object,
    {},
    __name__,
    __owner__,
    subscriptions,
    value,
  );

  class Value extends composition {
    static create = (current) => {
      const instance = new Value();
      if (current) {
        instance.current = current
      }
      return instance;
    };

    constructor() {
      super();
    }









  }

  return Type.register("value", Value);
})();
