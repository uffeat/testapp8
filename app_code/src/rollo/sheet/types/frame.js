/* 
20250303
src/rollo/sheet/types/frame.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/frame.js
import { Frame, FrameType } from "rollo/sheet/types/frame";
const { Frame, FrameType } = await import("rollo/sheet/types/frame");
*/

import { compose } from "@/rollo/tools/cls/compose.js";

import { get } from "@/rollo/sheet/types/rule/tools/items.js";

import { detail } from "@/rollo/sheet/types/rule/factories/detail.js";
import { json } from "@/rollo/sheet/types/rule/factories/json.js";
import { item } from "@/rollo/sheet/types/rule/factories/item.js";
import { size } from "@/rollo/sheet/types/rule/factories/size.js";
import { style } from "@/rollo/sheet/types/rule/factories/style.js";
import { text } from "@/rollo/sheet/types/rule/factories/text.js";

export function Frame(...args) {
  return new FrameType(...args);
}

/* Controller for CSSKeyframeRules. */
export class FrameType extends compose(
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

  /* Returns CSSKeyframeRule. */
  get rule() {
    return this.#rule;
  }

  /* Returns key text. */
  get key() {
    return this.rule.keyText || null;
  }

  /* Returns object representation of rule. */
  object() {
    return { [`${this.key}`]: get(this.rule) };
  }
}
