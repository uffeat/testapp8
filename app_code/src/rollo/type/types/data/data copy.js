import { type } from "rollo/type/type";
import { name } from "rollo/type/factories/name";
import { clean } from "rollo/type/types/data/factories/clean";
import { clear } from "rollo/type/types/data/factories/clear";
import { clone } from "rollo/type/types/data/factories/clone";
import { difference } from "rollo/type/types/data/factories/difference";
import { filter } from "rollo/type/types/data/factories/filter";
import { for_each } from "rollo/type/types/data/factories/for_each";
import { freeze } from "rollo/type/types/data/factories/freeze";
import { items } from "rollo/type/types/data/factories/items";
import { pop } from "rollo/type/types/data/factories/pop";
import { reduce } from "rollo/type/types/data/factories/reduce";
import { text } from "rollo/type/types/data/factories/text";
import { update } from "rollo/type/types/data/factories/update";

export const Data = (() => {
  const composition = type.compose(
    Object,
    {},
    clean,
    clear,
    clone,
    difference,
    filter,
    for_each,
    freeze,
    items,
    name,
    pop,
    reduce,
    text,
    update
  );

  class Data extends composition {
    static create = (update) => {
      const instance = new Data().update(update);
      return new Proxy(instance, {
        get: (target, key) => {
          return instance[key];
        },
        set: (target, key, value) => {
          instance[key] = value;
          return true;
        },
        has: (target, key) => {
          return key in instance.data;
        },
        apply: (target, thisArg, args) => {
          return instance.__call__.apply(instance, args);
        },
      });
    };

    constructor() {
      super();
    }

    __call__(...args) {
      console.log("Called with arguments:", args);
    }

    

    toString() {
      return this.jsonable ? this.json() : this.text();
    }
  }

  return type.register("data", Data);
})();
