/* 
20250302 
src/rollo/sheet/types/rules/rules.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rules/rules.js
*/

import { compose } from "@/rollo/tools/cls/compose.js";

import { detail } from "@/rollo/sheet/types/rule/factories/detail.js";
import { json } from "@/rollo/sheet/types/rule/factories/json.js";
import { add } from "@/rollo/sheet/types/rules/factories/add.js";
import { clear } from "@/rollo/sheet/types/rules/factories/clear.js";
import { get } from "@/rollo/sheet/types/rules/factories/get.js";
import { index } from "@/rollo/sheet/types/rules/factories/index.js";
import { object } from "@/rollo/sheet/types/rules/factories/object.js";
import { remove } from "@/rollo/sheet/types/rules/factories/remove.js";
import { size } from "@/rollo/sheet/types/rules/factories/size.js";
import { text } from "@/rollo/sheet/types/rules/factories/text.js";
import { update } from "@/rollo/sheet/types/rules/factories/update.js";
import { Rule } from "@/rollo/sheet/types/rule/rule.js";

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
