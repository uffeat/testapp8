/* 
20250303
src/rollo/sheet/types/frames.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/frames.js
import { Frames, FramesType } from "rollo/sheet/types/frames.js";
const { Frames, FramesType } = await import("rollo/sheet/types/frames.js");
*/

import { compose } from "@/rollo/tools/cls/compose.js";

import { Frame } from "@/rollo/sheet/types/frame.js";
import { KEYFRAMES } from "@/rollo/sheet/tools/constants.js";

import { add } from "@/rollo/sheet/types/rules/factories/add.js";
import { detail } from "@/rollo/sheet/types/rule/factories/detail.js";
import { json } from "@/rollo/sheet/types/rule/factories/json.js";
import { text } from "@/rollo/sheet/types/rule/factories/text.js";
import { update } from "@/rollo/sheet/types/rules/factories/update.js";


export function Frames(rule, registry) {
  return new FramesType(rule, registry);
}

/* Controller for CSSKeyframesRule. */
export class FramesType extends compose(
  null,
  {},
  add,
  detail,
  json,
  text,
  update
) {
  #__dict__ = {
    registry: new Map(),
    signature: {
      type: CSSKeyframesRule,
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

  /* Returns rule name. */
  get name() {
    return this.rule.name;
  }

  /* Returns owner (CSSKeyframesRule). */
  get owner() {
    return this.#owner;
  }

  /* Returns CSSKeyframesRule. */
  get rule() {
    return this.#rule;
  }

  

  /* Removes rules. Chainable. */
  clear() {
    [...this.rule.cssRules]
      .filter((r) => r instanceof CSSKeyframeRule)
      .forEach((r) => {
        this.rule.deleteRule(r.keyText);
        this.__dict__.registry.delete(r.keyText);
      });
    return this;
  }

  /* Returns wrapped child rule by frame. 
  NOTE
  - */
  get(frame) {
    frame = parse_frame(frame);
    let rule = this.__dict__.registry.get(frame);

    if (!rule) {
      /* Check if rule implemented, but not registered */
      const native = [...this.rule.cssRules].find((r) => r.keyText === frame);
      if (native) {
        rule = Frame(native);
      } else {
        this.rule.appendRule(`${frame} {}`);
        rule = Frame(this.rule.findRule(frame));
      }
      /* Register */
      this.__dict__.registry.set(frame, rule);
    }
    return rule;
  }

  /* Returns array of frames. */
  frames() {
    return [...this.rule.cssRules].map((r) => r.keyText);
  }

  /* Returns object representation of rule. */
  object() {
    let children = {};
    [...this.rule.cssRules]
      .reverse()
      .map((r) => Frame(r))
      .forEach((r) => (children = { ...r.object(), ...children }));
    return { [`${KEYFRAMES} ${this.name}`]: children };
  }

  /* Deletes and deregisters registered child rule by frame. */
  remove(frame) {
    frame = parse_frame(frame);
    this.__dict__.registry.delete(frame);
    this.rule.deleteRule(frame);
    return this;
  }

  /* Returns number of child rules. */
  size() {
    return this.rule.cssRules.length;
  }
}

function parse_frame(frame) {
  if (frame === "from") {
    return "0%";
  }
  if (frame === "to") {
    return "100%";
  }
  if (
    typeof frame === "number" ||
    (typeof frame === "string" && !frame.endsWith("%"))
  ) {
    return `${frame}%`;
  }
  if (Array.isArray(frame)) {
    return frame.map((f) => `${f}%`).join(",");
  }
  return frame;
}
