/* 
20250303
src/rollo/sheet/types/media.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/media.js
import { Media, MediaType } from "rollo/sheet/types/media.js";
const { Media, MediaType } = await import("rollo/sheet/types/media.js");
*/

import { compose } from "@/rollo/tools/cls/compose.js";
import { truncate } from "@/rollo/tools/text/truncate.js";

import { MediaRule } from "@/rollo/sheet/types/media_rule.js";
import { MEDIA } from "@/rollo/sheet/tools/constants.js";

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

export function Media(owner, registry) {
  return new MediaType(owner, registry);
}

/* Controller for CSSMediaRules. */
export class MediaType extends compose(
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
      child: { constructor: MediaRule },
      key: "conditionText",
      type: CSSMediaRule,
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

  /* Returns wrapped rule by condition. */
  get(condition) {
    if (condition.startsWith(MEDIA)) {
      condition = condition.slice(MEDIA.length).trim();
    }
    condition = parse_condition(condition);
    let rule = this.__dict__.registry.get(condition);
    if (!rule) {
      /* Check if rule implemented, but not registered */
      const native = [...this.owner.cssRules].find(
        (r) => r.conditionText === condition
      );
      if (native) {
        rule = MediaRule(native);
      } else {
        const index = this.owner.insertRule(
          `${MEDIA} ${condition} {}`,
          this.owner.cssRules.length
        );
        rule = MediaRule(this.owner.cssRules[index]);
      }
      /* Register */
      this.__dict__.registry.set(condition, rule);
    }
    return rule;
  }

  /* Return rule index by rule condition. */
  index(condition) {
    condition = parse_condition(condition);
    return super.index(condition);
  }

  /* Removes registered (wrapped) rule by condition. Chainable. */
  remove(condition) {
    condition = parse_condition(condition);
    super.remove(condition);
    return this;
  }
}

function parse_condition(condition) {
  condition = truncate(condition);
  if (!condition.startsWith("(")) {
    condition = `(${condition})`;
  }
  return condition;
}
