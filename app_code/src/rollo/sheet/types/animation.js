/* 
20250303
src/rollo/sheet/types/animation.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/animation.js
import { Animation, AnimationType } from "rollo/sheet/types/animation.js";
const { Animation, AnimationType } = await import("rollo/sheet/types/animation.js");
*/

import { compose } from "@/rollo/tools/cls/compose.js";

import { Frames } from "@/rollo/sheet/types/frames.js";
import { KEYFRAMES } from "@/rollo/sheet/tools/constants.js";

import { add } from "@/rollo/sheet/types/rules/factories/add.js";
import { clear } from "@/rollo/sheet/types/rules/factories/clear.js";
import { detail } from "@/rollo/sheet/types/rule/factories/detail.js";
import { index } from "@/rollo/sheet/types/rules/factories/index.js";
import { json } from "@/rollo/sheet/types/rule/factories/json.js";
import { object } from "@/rollo/sheet/types/rules/factories/object.js";
import { remove } from "@/rollo/sheet/types/rules/factories/remove.js";
import { size } from "@/rollo/sheet/types/rules/factories/size.js";
import { text } from "@/rollo/sheet/types/rules/factories/text.js";
import { update } from "@/rollo/sheet/types/rules/factories/update.js";


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
