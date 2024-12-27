import { type } from "rollo/type/type";
import { owner } from "rollo/type/factories/owner";
import { clear } from "rollo/type/types/data/factories/clear";
import { clone } from "rollo/type/types/data/factories/clone";
import { condition } from "rollo/type/types/data/factories/condition";
import { difference } from "rollo/type/types/data/factories/difference";
import { effects } from "rollo/type/types/data/factories/effects";
import { empty } from "rollo/type/types/data/factories/empty";
import { filter } from "rollo/type/types/data/factories/filter";
import { for_each } from "rollo/type/types/data/factories/for_each";
import { freeze } from "rollo/type/types/data/factories/freeze";
import { intersection } from "rollo/type/types/data/factories/intersection";
import { items } from "rollo/type/types/data/factories/items";
import { match } from "rollo/type/types/data/factories/match";
import { pop } from "rollo/type/types/data/factories/pop";
import { reduce } from "rollo/type/types/data/factories/reduce";
import { reset } from "rollo/type/types/data/factories/reset";
import { text } from "rollo/type/types/data/factories/text";
import { map } from "@/rollo/type/types/data/factories/map";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { update } from "rollo/type/types/data/factories/update";

export const Data = await (async () => {

  

  //Function
  //Object
  //class Base {},

  const composition = type.compose(
    Function,
    {},
    clear,
    clone,
    condition,
    difference,
    effects,
    empty,
    filter,
    for_each,
    freeze,
    intersection,
    items,
    map,
    match,
    owner,
    pop,
    reduce,
    reset,
    text,
    transformer,
    update
  );

  class Data extends composition {
    static create = (update) => {
      const instance = new Data();
      instance.update(update);

      return new Proxy(instance, {
        get: (target, key) => {
          return instance[key];
        },
        set: (target, key, value) => {
          if (instance.__chain__.defined.has(key)) {
            ////instance[key] = value;
            return Reflect.set(instance, key, value);////
          } else {
            instance.update({ [key]: value });
          }
          return true;
        },
        has: (target, key) => {
          return key in instance.current;
        },
        apply: (target, thisArg, args) => {
          return instance.update(...args);
        },
      });
    };

    constructor() {
      super();
    }
  }

  return type.register("data", Data);
})();
