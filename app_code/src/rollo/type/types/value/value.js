import { type } from "rollo/type/type/type";

import { condition } from "rollo/type/types/data/factories/condition";
import { effects } from "rollo/type/types/data/factories/effects";
import { transformer } from "rollo/type/types/data/factories/transformer";

import { clone } from "rollo/type/types/value/factories/clone";
import { match } from "rollo/type/types/value/factories/match";
import { name } from "rollo/type/types/value/factories/name";
import { owner } from "rollo/type/types/value/factories/owner";
import { type as type_factory } from "rollo/type/types/value/factories/type";
import { update } from "rollo/type/types/value/factories/update";
import { value } from "rollo/type/types/value/factories/value";

const cls = (() => {
  const composition = type.compose(
    Object,
    {},
    clone,
    condition,
    effects,
    match,
    name,
    owner,
    transformer,
    type_factory,
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
