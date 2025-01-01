import { type } from "rollo/type/type/type";
import { effects } from "rollo/type/types/list/list/factories/effects";
//import { update } from "rollo/type/types/list/list/factories/update";

/*
TODO 
$.foo -> adds foo */

const cls = (() => {
  const composition = type.compose(Array, {}, effects);

  class List extends composition {
    static name = "List";

    constructor(...values) {
      super();
    }

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
