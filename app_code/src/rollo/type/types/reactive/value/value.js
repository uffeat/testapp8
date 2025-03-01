// import { Value } from "@/rollo/type/types/reactive/value/value";
// const { Value } = await import("@/rollo/type/types/reactive/value/value");

import { type } from "rollo/type/type/type";

import { condition } from "@/rollo/type/types/reactive/factories/condition";
import { detail } from "@/rollo/type/types/reactive/factories/detail";
import { name } from "@/rollo/type/types/reactive/factories/name";
import { owner } from "@/rollo/type/types/reactive/factories/owner";
import { transformer } from "@/rollo/type/types/reactive/factories/transformer";

import { effects } from "@/rollo/type/types/reactive/value/factories/effects";
import { match } from "@/rollo/type/types/reactive/value/factories/match";
import { update } from "@/rollo/type/types/reactive/value/factories/update";

const cls = (() => {
  const composition = type.compose(
    Object,
    {},
    condition,
    detail,
    effects,
    match,
    name,
    owner,
    transformer,
    update
  );

  class Value extends composition {
    static name = "Value";

    #config;

    constructor({config}) {
      super();
      if (!config) {
        config = { effects: true };
      } else {
        config = { ...config };
        Object.freeze(config);
      }
      this.#config = config;
    }

    /* Returns config. */
    get config() {
      return this.#config;
    }
  }

  return type.register(Value);
})();

export class ValueType extends cls {
  constructor({ config } = {}) {
    super({ config });
    super.__new__ && super.__new__();
  }
}

/* Returns Value instance. */
export function Value(
  value,
  { condition, config, detail, effects, match, name, owner, transformer } = {},
  ...hooks
) {
  

  //const instance = type.create("value", {config});
  const instance = new ValueType({ config })

  instance.condition = condition;
  instance.name = name;
  instance.owner = owner;
  instance.transformer = transformer;

  if (detail !== undefined) {
    instance.detail = detail
  }
  if (match !== undefined) {
    instance.match = match
  }

  if (effects) {
    effects.forEach((effect) => instance.effects.add(effect));
  }

  if (value !== undefined) {
    instance.update(value);
  }

  hooks.forEach((hook) => hook.call(instance, instance));

  return instance;
}
