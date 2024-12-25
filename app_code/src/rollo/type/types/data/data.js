import { type } from "rollo/type/type";
import { name } from "rollo/type/factories/name";
import { clean } from "rollo/type/types/data/factories/clean";
import { clear } from "rollo/type/types/data/factories/clear";
import { clone } from "rollo/type/types/data/factories/clone";
import { condition } from "rollo/type/types/data/factories/condition";
import { difference } from "rollo/type/types/data/factories/difference";
import { filter } from "rollo/type/types/data/factories/filter";
import { for_each } from "rollo/type/types/data/factories/for_each";
import { freeze } from "rollo/type/types/data/factories/freeze";
import { items } from "rollo/type/types/data/factories/items";
import { pop } from "rollo/type/types/data/factories/pop";
import { reduce } from "rollo/type/types/data/factories/reduce";
import { reset } from "rollo/type/types/data/factories/reset";
import { text } from "rollo/type/types/data/factories/text";
import { transform } from "rollo/type/types/data/factories/transform";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { update } from "rollo/type/types/data/factories/update";

export const Data = (() => {
  const composition = type.compose(
    Function,
    {},
    clean,
    clear,
    clone,
    condition,
    difference,
    filter,
    for_each,
    freeze,
    items,
    name,
    pop,
    reduce,
    reset,
    text,
    transform,
    transformer,
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
          if (instance.__chain__.defined.has(key)) {
            instance[key] = value;
          } else {
            instance.update({ [key]: value });
          }

          return true;
        },
        has: (target, key) => {
          return key in instance.data;
        },
        apply: (target, thisArg, args) => {
          return instance.update.apply(instance, args);
        },
      });
    };

    constructor() {
      super();
    }

    toString() {
      return this.jsonable ? this.json() : this.text();
    }
  }

  return type.register("data", Data);
})();
