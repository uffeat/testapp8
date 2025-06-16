/*
import { Shadow } from "@/rollocomponent/shadow.js";
20250605
v.1.1
*/

import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";
import { registry } from "@/rollocomponent/tools/registry.js";
import { Sheets } from "@/rollosheet/tools/sheets.js";

/* NOTE The native shadow root has limited DOM manipulation features,
therefore use the special Shadow component. */

const cls = class extends mix(
  HTMLElement,
  {},
  mixins.append,
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
  static __tag__ = "rollo-shadow";

  #_ = {};

  constructor(owner) {
    super();
    this.#_.owner = owner;
    owner.attachShadow({ mode: "open" }).append(this);
    this.#_.slots = new (class {
      #_ = {};

      constructor(owner) {
        this.#_.owner = owner;
      }

      get owner() {
        return this.#_.owner;
      }

      has(name) {
        if (name) {
          return !!this.#_.owner.querySelector(`slot[name="${name}"]`)
        }
        return !!this.#_.owner.querySelector(`slot:not([name])`)
      }
    })(this);
    this.#_.sheets = new Sheets(owner.shadowRoot);
  }

  get owner() {
    return this.#_.owner;
  }

  get root() {
    return this.#_.owner.shadowRoot;
  }

  get sheets() {
    return this.#_.sheets;
  }

  get slots() {
    return this.#_.slots;
  }
};

registry.add(cls, "rollo-shadow");

export const Shadow = (owner) => new cls(owner);
