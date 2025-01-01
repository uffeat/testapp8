import { type } from "rollo/type/type/type";
import { __name__ } from "rollo/type/types/data/factories/__name__";
import { __owner__ } from "rollo/type/types/data/factories/__owner__";
import { effects } from "rollo/type/types/data/factories/effects";
import { update } from "rollo/type/types/value/factories/update";
import { value } from "rollo/type/types/value/factories/value";



const cls = (() => {
  const composition = type.compose(
    Object,
    {},
    __name__,
    __owner__,
    effects,
    update,
    value
  );

  class Value extends composition {
    static name = "Value";

    constructor(current) {
      super();
      this.current = current;
    }
  }

  return type.register(Value);
})();

/* .*/
export function Value(value) {
  return type.create("value", value);
}


export const ValueType = cls;
