/*
import { Base } from "@/rollocomponent/base.js";
20250615
v.1.0
*/

import { component } from "@/rollocomponent/component.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";
import { Shadow } from "@/rollocomponent/shadow.js";

export class Base extends mix(
  HTMLElement,
  {},
  mixins.attrs,
  mixins.classes,
  mixins.clear,
  mixins.components,
  mixins.connect,
  mixins.find,
  mixins.handlers,
  mixins.hooks,
  mixins.host,
  mixins.key,
  mixins.parent,
  mixins.props,
  mixins.send,
  mixins.state,
  mixins.style,
  mixins.tab,
  mixins.text,
  mixins.vars
) {
  #_ = {};

  constructor() {
    super();
    this.#_.shadow = Shadow(this);
    /* */
    this.#_.shadow.append(component.slot());
  }

  get shadow() {
    return this.#_.shadow;
  }

  append(...children) {
    this.#check(...children);
    super.append(...children);
    return this;
  }

  prepend(...children) {
    this.#check(...children);
    super.prepend(...children);
    return this;
  }

  /* Checks slots */
  #check(...children) {
    children.forEach((child) => {
      if (!this.shadow.slots.has(child.slot)) {
        if (child.slot) {
          throw new Error(`No default slot.`);
        } else {
          throw new Error(`Invalid slot: ${child.slot}.`);
        }
      }
    });
  }
}
