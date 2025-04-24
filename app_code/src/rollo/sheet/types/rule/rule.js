/* 
20250302 
src/rollo/sheet/types/rule/rule.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rule/rule.js
*/
import { compose } from "@/rollo/tools/cls/compose.js";

import { detail } from "@/rollo/sheet/types/rule/factories/detail.js";
import { json } from "@/rollo/sheet/types/rule/factories/json.js";
import { item } from "@/rollo/sheet/types/rule/factories/item.js";
import { size } from "@/rollo/sheet/types/rule/factories/size.js";
import { style } from "@/rollo/sheet/types/rule/factories/style.js";
import { text } from "@/rollo/sheet/types/rule/factories/text.js";

import { get } from "@/rollo/sheet/types/rule/tools/items.js";

export function Rule(rule) {
  const instance = new RuleType(rule);
  if (instance.__new__) {
    instance.__new__();
  }
  return instance;
}

/* Controller for CSSStyleRules. */
export class RuleType extends compose(
  null,
  {},
  detail,
  item,
  json,
  size,
  style,
  text
) {
  #__dict__ = {
    current: {},
  };
  #rule;

  constructor(rule) {
    super();
    this.#rule = rule;
    if (rule.style.length) {
      this.__dict__.current = get(rule);
    }
  }

  get __dict__() {
    return this.#__dict__;
  }

  /* Returns CSSStyleRule. */
  get rule() {
    return this.#rule;
  }

  /* Returns selector text. */
  get selector() {
    return this.rule.selectorText || null;
  }

  /* Returns object representation of rule. */
  object() {
    return { [`${this.selector}`]: get(this.rule) };
  }
}

