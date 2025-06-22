/*
import { Shadow } from "@/rollocomponent/shadow.js";
20250605
v.1.1
*/

import { component } from "@/rollocomponent/component.js";
import { factory } from "@/rollocomponent/tools/factory.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { registry } from "@/rollocomponent/tools/registry.js";
import { Sheets } from "@/rollosheet/tools/sheets.js";



import append from "@/rollocomponent/mixins/append.js";
import attrs from "@/rollocomponent/mixins/attrs.js";
import classes from "@/rollocomponent/mixins/classes.js";
import clear from "@/rollocomponent/mixins/clear.js";
import components from "@/rollocomponent/mixins/components.js";
import connect from "@/rollocomponent/mixins/connect.js";
import effect from "@/rollocomponent/mixins/effect.js";
import find from "@/rollocomponent/mixins/find.js";
import handlers from "@/rollocomponent/mixins/handlers.js";
import hooks from "@/rollocomponent/mixins/hooks.js";
import host from "@/rollocomponent/mixins/host.js";
import insert from "@/rollocomponent/mixins/insert.js";
import key from "@/rollocomponent/mixins/key.js";
import parent from "@/rollocomponent/mixins/parent.js";
import props from "@/rollocomponent/mixins/props.js";
import send from "@/rollocomponent/mixins/send.js";
import setup from "@/rollocomponent/mixins/setup.js";
import state from "@/rollocomponent/mixins/state.js";
import style from "@/rollocomponent/mixins/style.js";
import super_ from "@/rollocomponent/mixins/super_.js";
import tab from "@/rollocomponent/mixins/tab.js";
import text from "@/rollocomponent/mixins/text.js";
import vars from "@/rollocomponent/mixins/vars.js";

/* NOTE The native shadow root has limited DOM manipulation features,
therefore use the special Shadow component. */

const cls = class extends mix(
  HTMLElement,
  {},
  append,
  attrs,
  classes,
  clear,
  //components,
  connect,
  find,
  handlers,
  hooks,
  //host,
  insert,
  //key,
  parent,
  props,
  send,
  //setup,
  //state,
  style,
  super_,
  tab,
  text,
  vars
) {
  static __key__ = "rollo-shadow";

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

      get(name) {
        if (name) {
          return this.#_.owner.querySelector(`slot[name="${name}"]`);
        }
        return this.#_.owner.querySelector(`slot:not([name])`);
      }

      has(name) {
        if (name) {
          return !!this.#_.owner.querySelector(`slot[name="${name}"]`);
        }
        return !!this.#_.owner.querySelector(`slot:not([name])`);
      }
    })(this);

    this.#_.sheets = new Sheets(owner.shadowRoot);
  }

  __new__() {
    super.__new__?.();
    this.append(component.slot())
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

/* NOTE 'author' is not used, since a custom factory with a single-arg 
signature is needed. */

registry.add(cls);

export const Shadow = (owner) => {
  /* Ensure that __new__ and __init__ methods are called */
  return factory(new cls(owner))();
};
