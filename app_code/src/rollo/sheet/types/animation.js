import { compose } from "@/rollo/tools/cls/compose";
import { add } from "@/rollo/sheet/types/rules/factories/add";
import { clear } from "@/rollo/sheet/types/rules/factories/clear";
import { detail } from "@/rollo/sheet/types/rule/factories/detail";
import { index } from "@/rollo/sheet/types/rules/factories/index";
import { json } from "@/rollo/sheet/types/rule/factories/json";
import { object } from "@/rollo/sheet/types/rules/factories/object";
import { remove } from "@/rollo/sheet/types/rules/factories/remove";
import { size } from "@/rollo/sheet/types/rules/factories/size";
import { text } from "@/rollo/sheet/types/rules/factories/text";
import { update } from "@/rollo/sheet/types/rules/factories/update";
import { Frames } from "@/rollo/sheet/types/frames";
import { KEYFRAMES } from "@/rollo/sheet/tools/constants";

export function Animation(owner, registry) {
  return new AnimationType(owner, registry);
}

/* Controller for CSSKeyframesRules. */
export class AnimationType extends compose(
  null,
  {},
  add,
  clear,
  detail,
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
      child: { constructor: Frames },
      key: "name",
      type: CSSKeyframesRule,
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

  /* Returns wrapped rule.
    NOTE
    - */
  get(header) {
    if (header.startsWith(KEYFRAMES)) {
      header = header.slice(KEYFRAMES.length).trim();
    }
    const key = this.__dict__.signature.key;
    let rule = this.__dict__.registry.get(header);
    if (!rule) {
      /* Check if rule implemented, but not registered */
      const native = [...this.owner.cssRules].find((r) => r[key] === header);
      if (native) {
        rule = Frames(native);
      } else {
        const index = this.owner.insertRule(
          `${KEYFRAMES} ${header} {}`,
          this.owner.cssRules.length
        );
        rule = Frames(this.owner.cssRules[index]);
      }
      /* Register */
      this.__dict__.registry.set(header, rule);
    }
    return rule;
  }
}
