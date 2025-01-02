import { type } from "rollo/type/type/type";
import { effects } from "rollo/type/types/list/list/factories/effects";
//import { update } from "rollo/type/types/list/list/factories/update";

/*
TODO 
$.foo -> adds foo */

const cls = (() => {
  const composition = type.compose(Object, {}, effects);

  class List extends composition {
    static name = "List";

    constructor(...values) {
      super();
    }

    /* TODO
    - Start with non-reactive version that supports 'difference', 'match', 'update', 'size' 'add' and 'remove'
    - Use hidden data container - array or set - probably set (native support for remove)
    - Channel everything through update */

    add(...values) {
      const added = values.filter(
        (v) => !this.includes(v) && v !== undefined
      );
      const removed = values.filter(
        (v) => this.includes(v) && v === undefined
      );
      /* Update */
      /* TODO
      */
      

      this.effects.call({});

      return this;
    }
  }

  return type.register(List);
})();

/* .*/
export function Value(...values) {
  return type.create("list", ...values);
}

export const ListType = cls;
