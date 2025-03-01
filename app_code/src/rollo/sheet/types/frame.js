import { compose } from "@/rollo/tools/cls/compose";
import { detail } from "@/rollo/sheet/types/rule/factories/detail";
import { get } from "@/rollo/sheet/types/rule/tools/items";
import { json } from "@/rollo/sheet/types/rule/factories/json";
import { item } from "@/rollo/sheet/types/rule/factories/item";
import { size } from "@/rollo/sheet/types/rule/factories/size";
import { style } from "@/rollo/sheet/types/rule/factories/style";
import { text } from "@/rollo/sheet/types/rule/factories/text";

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
