import { compose } from "@/rollo/tools/cls/compose";
import { detail } from "@/rollo/sheet/types/rule/factories/detail";
import { json } from "@/rollo/sheet/types/rule/factories/json";
import { add } from "@/rollo/sheet/types/rules/factories/add";
import { clear } from "@/rollo/sheet/types/rules/factories/clear";
import { get } from "@/rollo/sheet/types/rules/factories/get";
import { index } from "@/rollo/sheet/types/rules/factories/index";
import { object } from "@/rollo/sheet/types/rules/factories/object";
import { remove } from "@/rollo/sheet/types/rules/factories/remove";
import { size } from "@/rollo/sheet/types/rules/factories/size";
import { text } from "@/rollo/sheet/types/rules/factories/text";
import { update } from "@/rollo/sheet/types/rules/factories/update";
import { Rule } from "@/rollo/sheet/types/rule/rule";

export function Rules(owner, registry) {
  return new RulesType(owner, registry);
}

/* Controller for style rules. */
export class RulesType extends compose(
  null,
  {},
  add,
  clear,
  detail,
  get,
  index,
  json,
  object,
  remove,
  size,
  text,
  update
) {
  #__dict__ = {
    registry: new Map(),
    signature: {
      child: { constructor: Rule },
      key: "selectorText",
      type: CSSStyleRule,
    },
  };
  #owner;

  constructor(owner, registry) {
    super();
    this.#owner = owner;
    if (registry) {
      this.__dict__.registry = registry;
    }
  }

  get __dict__() {
    return this.#__dict__;
  }

  /* Returns owner (CSSStyleSheet). */
  get owner() {
    return this.#owner;
  }
}
