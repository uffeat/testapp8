import { type } from "rollo/type/type";
import { clean } from "rollo/type/types/data/factories/clean";
import { clear } from "rollo/type/types/data/factories/clear";
import { filter } from "rollo/type/types/data/factories/filter";
import { for_each } from "rollo/type/types/data/factories/for_each";
import { items } from "rollo/type/types/data/factories/items";
import { pop } from "rollo/type/types/data/factories/pop";
import { update } from "rollo/type/types/data/factories/update";

type.register(
  "data",
  class Data extends type.compose(
    Object,
    {},
    clean,
    clear,
    filter,
    for_each,
    items,
    pop,
    update
  ) {
    static create = (update) => {
      return new Data().update(update);
    };
    constructor() {
      super();
    }

    /* Returns shallow clone. Enables use of mutaing methods without mutation. */
    clone() {
      return this.__class__.create({ ...this });
    }

    /* Freezes object shallowly. Chainable. */
    freeze() {
      return Object.freeze(this);
    }

    /* Calls a series of functions with one function's result passed into the next 
    function. A copy of this object is passed into the first function. Returns 
    the result of the last function. */
    reduce(...funcs) {
      let value = this.clone();
      for (const func of funcs) {
        value = func(value);
      }
      return value;
    }
  }
);
