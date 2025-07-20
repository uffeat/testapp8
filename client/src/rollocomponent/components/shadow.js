import { Sheets } from "@/rollosheet/sheets.js";

import { component } from "@/rollocomponent/component.js";
import { factory } from "@/rollocomponent/tools/factory.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { registry } from "@/rollocomponent/tools/registry.js";

import append from "@/rollocomponent/mixins/mixins/append.js";
import attrs from "@/rollocomponent/mixins/mixins/attrs.js";
import classes from "@/rollocomponent/mixins/mixins/classes.js";
import clear from "@/rollocomponent/mixins/mixins/clear.js";
import components from "@/rollocomponent/mixins/mixins/components.js";
import connect from "@/rollocomponent/mixins/mixins/connect.js";
import detail from "@/rollocomponent/mixins/mixins/detail.js";
import find from "@/rollocomponent/mixins/mixins/find.js";
import handlers from "@/rollocomponent/mixins/mixins/handlers.js";
import hooks from "@/rollocomponent/mixins/mixins/hooks.js";
import host from "@/rollocomponent/mixins/mixins/host.js";
import insert from "@/rollocomponent/mixins/mixins/insert.js";
import key from "@/rollocomponent/mixins/mixins/key.js";
import parent from "@/rollocomponent/mixins/mixins/parent.js";
import props from "@/rollocomponent/mixins/mixins/props.js";
import send from "@/rollocomponent/mixins/mixins/send.js";
import setup from "@/rollocomponent/mixins/mixins/setup.js";
import states from "@/rollocomponent/mixins/mixins/states.js";
import style from "@/rollocomponent/mixins/mixins/style.js";
import super_ from "@/rollocomponent/mixins/mixins/super_.js";
import tab from "@/rollocomponent/mixins/mixins/tab.js";
import tree from "@/rollocomponent/mixins/mixins/tree.js";
import text from "@/rollocomponent/mixins/mixins/text.js";
import vars from "@/rollocomponent/mixins/mixins/vars.js";

/* NOTE The native shadow root has limited DOM manipulation features,
therefore use the special Shadow component. */

const cls = class extends mix(
  HTMLElement,
  {},
  append,
  attrs,
  classes,
  clear,
  components,
  connect,
  detail,
  find,
  handlers,
  hooks,
  host,
  insert,
  key,
  parent,
  props,
  send,
  setup,
  states,
  style,
  super_,
  tab,
  tree,
  text,
  vars
) {
  static __key__ = "rollo-shadow";

  #_ = {};

  constructor(owner) {
    super();
    this.id = "root";
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
    this.append(component.slot());
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
