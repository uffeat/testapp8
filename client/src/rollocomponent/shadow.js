/*
import { Shadow } from "@/rollocomponent/shadow.js";
20250605
v.1.1
*/

import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";
import { author } from "@/rollocomponent/tools/author.js";

const cls = class extends mix(
  HTMLElement,
  {},
  mixins.append, //
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
  //mixins.slots,
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
    //this.#_.owner = owner;
    //owner.attachShadow({ mode: "open" }).append(this);

    /*
    Object.defineProperty(owner, "shadow", {
      configurable: true,
      enumerable: false,
      get: () => this,
    });
    */
  }

  get owner() {
    return this.#_.owner;
  }

  set owner(owner) {
    this.#_.owner = owner;
    owner.attachShadow({ mode: "open" }).append(this);



    Object.defineProperty(owner, "shadow", {
      configurable: true,
      enumerable: false,
      get: () => this,
    });
  }
};

export const Shadow = author(cls);
