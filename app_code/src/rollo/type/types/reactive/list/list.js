// import { List } from "@/rollo/type/types/reactive/list/list";
// const { List } = await import("@/rollo/type/types/reactive/list/list");

import { type } from "rollo/type/type/type";

import { condition } from "@/rollo/type/types/reactive/factories/condition";
import { detail } from "@/rollo/type/types/reactive/factories/detail";
import { name } from "@/rollo/type/types/reactive/factories/name";
import { owner } from "@/rollo/type/types/reactive/factories/owner";
import { transformer } from "@/rollo/type/types/reactive/factories/transformer";

import { clear } from "@/rollo/type/types/reactive/list/factories/clear";
import { difference } from "@/rollo/type/types/reactive/list/factories/difference";
import { effects } from "@/rollo/type/types/reactive/list/factories/effects";
import { entries } from "@/rollo/type/types/reactive/list/factories/entries";
import { filter } from "@/rollo/type/types/reactive/list/factories/filter";
import { for_each } from "@/rollo/type/types/reactive/list/factories/for_each";
import { has } from "@/rollo/type/types/reactive/list/factories/has";
import { includes } from "@/rollo/type/types/reactive/list/factories/includes";
import { index } from "@/rollo/type/types/reactive/list/factories/index";
import { intersection } from "@/rollo/type/types/reactive/list/factories/intersection";
import { map } from "@/rollo/type/types/reactive/list/factories/map";
import { match } from "@/rollo/type/types/reactive/list/factories/match";
import { size } from "@/rollo/type/types/reactive/list/factories/size";
import { text } from "@/rollo/type/types/reactive/list/factories/text";
import { union } from "@/rollo/type/types/reactive/list/factories/union";
import { update } from "@/rollo/type/types/reactive/list/factories/update";

const cls = (() => {
  const composition = type.compose(
    Object,
    {},
    clear,
    condition,
    detail,
    difference,
    effects,
    entries,
    filter,
    for_each,
    has,
    includes,
    index,
    intersection,
    map,
    match,
    name,
    owner,
    size,
    text,
    transformer,
    union,
    update
  );

  class List extends composition {
    static name = "List";

    #__dict__;
    #config;

    constructor({ config }) {
      super();
      /* Create dict as a means to share pseudo-private fields across 
      factories */
      this.#__dict__ = {
        current: new Set(),
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

  return type.register(List);
})();

export class ListType extends cls {
  constructor({ config } = {}) {
    super({ config });
    super.__new__ && super.__new__();
  }
}

/* Returns List instance. */
export function List(
  values,
  { condition, config, detail, effects, name, owner, transformer } = {},
  ...hooks
) {
  //const instance = type.create("list", { config });
  const instance = new ListType({ config });

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

  if (values) {
    instance.add(...values);
  }

  hooks.forEach((hook) => hook.call(instance, instance));

  return instance;
}
