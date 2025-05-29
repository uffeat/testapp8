/*
import { component } from "@/rollocomponent/component.js";
20250530
v.1.1
*/

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
import insert from "@/rollocomponent/mixins/insert.js";
import key from "@/rollocomponent/mixins/key.js";
import novalidation from "@/rollocomponent/mixins/novalidation.js";
import props from "@/rollocomponent/mixins/props.js";
import send from "@/rollocomponent/mixins/send.js";
import state from "@/rollocomponent/mixins/state.js";
import style from "@/rollocomponent/mixins/style.js";
import tab from "@/rollocomponent/mixins/tab.js";
import text from "@/rollocomponent/mixins/text.js";
import vars from "@/rollocomponent/mixins/vars.js";

export { State } from "@/rollocomponent/tools/state.js";

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
      insert,
      key,
      props,
      send,
      state,
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

    class cls extends mixin(base, {}, ...mixins) {
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
      return function (...args) {
        /* Extract updates as first or second arg that is a plain object */
        const updates =
          args.find(
            (a, i) =>
              i < 2 &&
              typeof a === "object" &&
              !(a instanceof Node) &&
              typeof a !== "function" &&
              !Array.isArray(a)
          ) || {};

        /* Use updates */
        instance.update(updates);

        /* Extract child elements */
        const children = args.filter((a) => a instanceof Node);

        /* Transfer state to child elements, if they have none declared */
        children.forEach((child) => {
          if (!child.state) {
            child.state = updates.state;
          }
        });

        /* TODO
        - Handle host and key */

        /* Extract text as non-first numner or string arument */
        const text = args.find(
          (a, i) => i && ["number", "string"].includes(typeof a)
        );

        /* Use text
         NOTE Convention: Any text is inserted before any child elements  */
        if (text) {
          instance.append(text);
        }

        /* Handle parent */
        if (updates.parent && instance.parentElement !== updates.parent) {
          updates.parent.append(instance);
        }

        return (
          instance.classes
            /* Add CSS classes */
            .add(args.find((a, i) => !i && typeof a === "string"))
            /* Add child elements */
            .append(...children)
            /* Call hooks.
            NOTE Doen last to ensure that hooks have all info about the component */
            .hooks(...args.filter((a) => typeof a === "function"))
        );
      };
    },
  }
);

function mixin(cls, config, ...mixins) {
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
}
