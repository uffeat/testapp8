/*
import { component } from "@/rollocomponent/component.js";
20250527
v.1.0
*/

import { Args } from "./tools/args.js";

import append from "@/rollocomponent/mixins/append.js";
import attrs from "@/rollocomponent/mixins/attrs.js";
import classes from "@/rollocomponent/mixins/classes.js";
import clear from "@/rollocomponent/mixins/clear.js";
import connect from "@/rollocomponent/mixins/connect.js";
import effect from "@/rollocomponent/mixins/effect.js";
import find from "@/rollocomponent/mixins/find.js";
import for_ from "@/rollocomponent/mixins/for_.js";
import handlers from "@/rollocomponent/mixins/handlers.js";
import hooks from "@/rollocomponent/mixins/hooks.js";
import host from "@/rollocomponent/mixins/host.js";
import insert from "@/rollocomponent/mixins/insert.js";
import key from "@/rollocomponent/mixins/key.js";
import novalidation from "@/rollocomponent/mixins/novalidation.js";
import parent from "@/rollocomponent/mixins/parent.js";
import props from "@/rollocomponent/mixins/props.js";
import send from "@/rollocomponent/mixins/send.js";
import setup from "@/rollocomponent/mixins/setup.js"; ////
import style from "@/rollocomponent/mixins/style.js";
import tab from "@/rollocomponent/mixins/tab.js";
import text from "@/rollocomponent/mixins/text.js";
import vars from "@/rollocomponent/mixins/vars.js";

const registry = new (class {
  #_ = {
    registry: new Map(),
  };

  get(tag) {
    if (this.#_.registry.has(tag)) {
      return this.#_.registry.get(tag);
    }
    const ref = document.createElement(tag);
    const base = ref.constructor;
    if (base === HTMLUnknownElement) {
      throw new Error(`'${tag}' is not native.`);
    }
    const mixins = [
      append,
      attrs,
      classes,
      clear,
      connect,
      effect,
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
      style,
      tab,
      vars,
    ];

    if ("textContent" in ref) {
      mixins.push(text);
    }
    if (tag === "form") {
      mixins.push(novalidation);
    }
    if (tag === "label") {
      mixins.push(for_);
    }
    class cls extends mix(base, {}, ...mixins) {
      constructor() {
        super();
        this.setAttribute("web-component", "");
      }
    }
    this.#_.registry.set(tag, cls);
    customElements.define(`x-${tag}`, cls, {
      extends: tag,
    });
    if (import.meta.env.DEV) {
      console.info("Registered component with tag:", tag);
    }
    return cls;
  }
})();

/* Returns instance of native web component. */
export const component = new Proxy(
  {},
  {
    get: (_, tag) => {
      const instance = new (registry.get(tag))();
      return (...args) => {
        /* Parse args */
        args = new Args(args);
        /* Add CSS classes */
        instance.classes.add(args.classes);
        /* Use updates */
        instance.update(args.updates);
        /* Append children */
        instance.append(...args.children);
        /* Set up child elements */
        args.children.forEach((child) => {
          if (child instanceof Node) {
            child.setup?.({ parent: instance });
          }
        });
        return instance.hooks(...args.hooks);
      };
    },
  }
);

function mix(cls, config, ...mixins) {
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
}
