import { type } from "rollo/type/type";
import { __name__ } from "rollo/type/factories/__name__";
import { __owner__ } from "rollo/type/factories/__owner__";
import { clear } from "rollo/type/types/data/factories/clear";
import { clone } from "rollo/type/types/data/factories/clone";
import { condition } from "rollo/type/types/data/factories/condition";
import { difference } from "rollo/type/types/data/factories/difference";
import { empty } from "rollo/type/types/data/factories/empty";
import { filter } from "rollo/type/types/data/factories/filter";
import { for_each } from "rollo/type/types/data/factories/for_each";
import { freeze } from "rollo/type/types/data/factories/freeze";
import { includes } from "rollo/type/types/data/factories/includes";
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

/* Reactive key-value store with batch-update, array- and set-like methods,  
and methods for in-place mutation. 
NOTE
- Zero dependencies.
- Pure JS; does not use browser APIs.
- Relies on Vite, only for import syntax.
*/
export const Data = (() => {
  const composition = type.compose(
    Object,
    {},
    __name__,
    __owner__,
    clear,
    clone,
    condition,
    difference,
    empty,
    filter,
    for_each,
    freeze,
    includes,
    intersection,
    items,
    map,
    match,
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
      return instance;
    };

    constructor() {
      super();
    }
  }

  return type.register("data", Data);
})();
