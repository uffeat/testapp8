// import { Data } from "@/rollo/type/types/reactive/data/data";
// const { Data } = await import("@/rollo/type/types/reactive/data/data");

import { type } from "rollo/type/type/type";

import { condition } from "@/rollo/type/types/reactive/factories/condition";
import { detail } from "@/rollo/type/types/reactive/factories/detail";
import { name } from "@/rollo/type/types/reactive/factories/name";
import { owner } from "@/rollo/type/types/reactive/factories/owner";
import { transformer } from "@/rollo/type/types/reactive/factories/transformer";

import { $ } from "@/rollo/type/types/reactive/data/factories/$";
import { clear } from "@/rollo/type/types/reactive/data/factories/clear";
import { difference } from "@/rollo/type/types/reactive/data/factories/difference";
import { effects } from "@/rollo/type/types/reactive/data/factories/effects";
import { filter } from "@/rollo/type/types/reactive/data/factories/filter";
import { for_each } from "@/rollo/type/types/reactive/data/factories/for_each";
import { includes } from "@/rollo/type/types/reactive/data/factories/includes";
import { intersection } from "@/rollo/type/types/reactive/data/factories/intersection";
import { items } from "@/rollo/type/types/reactive/data/factories/items";
import { map } from "@/rollo/type/types/reactive/data/factories/map";
import { match } from "@/rollo/type/types/reactive/data/factories/match";
import { pop } from "@/rollo/type/types/reactive/data/factories/pop";
import { reset } from "@/rollo/type/types/reactive/data/factories/reset";
import { text } from "@/rollo/type/types/reactive/data/factories/text";
import { update } from "@/rollo/type/types/reactive/data/factories/update";

const cls = (() => {
  const composition = type.compose(
    Object,
    {},
    $,
    clear,
    condition,
    detail,
    difference,
    effects,
    filter,
    for_each,
    includes,
    intersection,
    items,
    map,
    match,
    name,
    owner,
    pop,
    reset,
    text,
    transformer,
    update
  );

  class Data extends composition {
    static name = "Data";

    #__dict__;
    #config;

    constructor({ config }) {
      super();
      /* Create dict as a means to share pseudo-private fields across 
      factories */
      this.#__dict__ = {
        current: {},
      };
      if (!config) {
        config = { effects: true };
      } else {
        config = { ...config };
        Object.freeze(config);
      }
      this.#config = config;
    }

    /* Returns __dict__. */
    get __dict__() {
      return this.#__dict__;
    }

    /* Returns config. */
    get config() {
      return this.#config;
    }
  }

  return type.register(Data);
})();

export class DataType extends cls {
  constructor({ config } = {}) {
    super({ config });
    super.__new__ && super.__new__();
  }
}

/* Returns Data instance. */
export function Data(
  updates,
  { condition, config, detail, effects, name, owner, transformer } = {},
  ...hooks
) {
  //const instance = type.create("data", {config});
  const instance = new DataType({ config });

  instance.condition = condition;
  instance.name = name;
  instance.owner = owner;
  instance.transformer = transformer;

  if (detail !== undefined) {
    instance.detail = detail;
  }

  if (effects) {
    effects.forEach((effect) => instance.effects.add(effect));
  }

  if (updates) {
    instance.update(updates);
  }

  hooks.forEach((hook) => hook.call(instance, instance));

  return instance;
}
