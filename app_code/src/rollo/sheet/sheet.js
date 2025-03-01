// import { Sheet } from "@/rollo/tools/sheet/sheet";
// const { Sheet } = await import("@/rollo/tools/sheet/sheet");

import { compose } from "@/rollo/tools/cls/compose";
import { targets } from "@/rollo/sheet/factories/targets";
import { detail } from "@/rollo/sheet/types/rule/factories/detail";
import { json } from "@/rollo/sheet/types/rule/factories/json";
import { truncate } from "@/rollo/tools/text/truncate";
import { Animation } from "@/rollo/sheet/types/animation";
import { Media } from "@/rollo/sheet/types/media";
import { Rules } from "@/rollo/sheet/types/rules/rules";
import { is_target } from "@/rollo/sheet/tools/target";
import { KEYFRAMES, MEDIA } from "@/rollo/sheet/tools/constants";

/* Returns SheetType instance. */
export function Sheet(...args) {
  return new SheetType(...args);
}

/* Constructable style sheet with support for:
- Standard, media, and keyframes rules.
- Control of adoption targets.
- Construction from text, arrays and/or plain object.
- Dynamic rule change.
- Mitigation of rule redundancy.
- Representation of sheet and rules in serializable formats, primarily for 
  testing and alternative storage/retrieval.
- Single-line sheet configuration.
*/
export class SheetType extends compose(
  CSSStyleSheet,
  {},
  detail,
  json,
  targets
) {
  #__dict__ = {
    name: null,
  };

  constructor(...args) {
    super();
    /* Set props */
    args
      .filter(
        (a, i) => !i && typeof a === "object" && !is_hook(a) && !is_target(a)
      )
      .forEach((p) =>
        Object.entries(p).forEach(([k, v]) => {
          if (!(k in this.#__dict__)) {
            throw new Error(`Invalid key: ${k}`);
          }
          this.#__dict__[k] = v;
        })
      );

    /* Build from text */
    this.replaceSync(
      truncate(args.filter((a) => typeof a === "string").join(" "))
    );
    /* Add rules */
    this.add(
      ...args.filter(
        (a, i) => i && typeof a === "object" && !is_hook(a) && !is_target(a)
      )
    );
    /* Run hooks */
    args.filter(is_hook).forEach((h) => h.call(this, this));
    /* Adopt to targets */
    this.targets.add(...args.filter(is_target));
  }

  get __dict__() {
    return this.#__dict__;
  }

  get animation() {
    return this.#animation;
  }
  #animation = Animation(this);

  /* Returns controller for top-level media rules. */
  get media() {
    return this.#media;
  }
  #media = Media(this);

  /* Returns name. */
  get name() {
    return this.#__dict__.name;
  }

  /* Returns controller for top-level standard rules. */
  get rules() {
    return this.#rules;
  }
  #rules = Rules(this);

  /* Adds rules. Chainable. */
  add(...rules) {
    for (const rule of rules) {
      for (const [header, body] of Object.entries(rule)) {
        if (header.startsWith(KEYFRAMES)) {
          this.animation.add({ [header]: body });
          continue;
        }
        if (header.startsWith(MEDIA)) {
          this.media.add({ [header]: body });
          continue;
        }
        this.rules.add({ [header]: body });
      }
    }
    return this;
  }

  /* Removes all rules. Chainable. */
  clear() {
    this.animation.clear();
    this.media.clear();
    this.rules.clear();
    return this;
  }

  /* Returns object representation of sheet content. */
  object() {
    return {
      ...this.rules.object(),
      ...this.animation.object(),
      ...this.media.object(),
    };
  }

  /* Returns number of top-level rules. */
  size() {
    return this.cssRules.length;
  }

  /* Returns text representation of sheet content */
  text(pretty = true) {
    const fragments = [];
    for (const rule of this.cssRules) {
      fragments.push(pretty ? rule.cssText : truncate(rule.cssText));
    }
    return fragments.join(pretty ? "\n" : " ");
  }
}

function is_hook(a) {
  return typeof a === "function";
}
