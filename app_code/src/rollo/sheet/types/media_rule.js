/* 
20250303
src/rollo/sheet/types/media_rule.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/media_rule.js
import { MediaRule, MediaRuleType } from "rollo/sheet/types/media_rule.js";
const { MediaRule, MediaRuleType } = await import("rollo/sheet/types/media_rule.js");
*/

import { compose } from "@/rollo/tools/cls/compose.js";

import { Rule } from "@/rollo/sheet/types/rule/rule.js";
import { MEDIA } from "@/rollo/sheet/tools/constants.js";

import { detail } from "@/rollo/sheet/types/rule/factories/detail.js";
import { json } from "@/rollo/sheet/types/rule/factories/json.js";
import { add } from "@/rollo/sheet/types/rules/factories/add.js";
import { clear } from "@/rollo/sheet/types/rules/factories/clear.js";
import { get } from "@/rollo/sheet/types/rules/factories/get.js";
import { index } from "@/rollo/sheet/types/rules/factories/index.js";
import { remove } from "@/rollo/sheet/types/rules/factories/remove.js";
import { size } from "@/rollo/sheet/types/rules/factories/size.js";
import { text } from "@/rollo/sheet/types/rules/factories/text.js";
import { update } from "@/rollo/sheet/types/rules/factories/update.js";

export function MediaRule(...args) {
  return new MediaRuleType(...args);
}

/* Controller for CSSMediaRule. */
export class MediaRuleType extends compose(
  null,
  {},
  add,
  clear,
  detail,
  get,
  index,
  json,
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
  #rule;

  constructor(rule, registry) {
    super();
    this.#rule = this.#owner = rule;
    if (registry) {
      this.__dict__.registry = registry;
    }
  }

  get __dict__() {
    return this.#__dict__;
  }

  /* Returns condition text. */
  get condition() {
    return this.rule.conditionText || null;
  }

  /* Returns owner (CSSMediaRule). */
  get owner() {
    return this.#owner;
  }

  /* Returns CSSMediaRule rule. */
  get rule() {
    return this.#rule;
  }

  /* Returns object representation of rule. */
  object() {
    let children = {};
    [...this.rule.cssRules]
      .reverse()
      .map((r) => Rule(r))
      .forEach((r) => (children = { ...r.object(), ...children }));
    return { [`${MEDIA} ${this.condition}`]: children };
  }
}
