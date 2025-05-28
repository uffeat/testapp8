//import append from "@/rollocomponent/mixins/append.js";
import attrs from "@/rollocomponent/mixins/attrs.js";
import classes from "@/rollocomponent/mixins/classes.js";
import clear from "@/rollocomponent/mixins/clear.js";
import connect from "@/rollocomponent/mixins/connect.js";
import find from "@/rollocomponent/mixins/find.js";
import handlers from "@/rollocomponent/mixins/handlers.js";
import hooks from "@/rollocomponent/mixins/hooks.js";
import insert from "@/rollocomponent/mixins/insert.js";
import props from "@/rollocomponent/mixins/props.js";
import send from "@/rollocomponent/mixins/send.js";
import style from "@/rollocomponent/mixins/style.js";
import tab from "@/rollocomponent/mixins/tab.js";
import text from "@/rollocomponent/mixins/text.js";
import vars from "@/rollocomponent/mixins/vars.js";

const standard = [
  (await use("@/rollocomponent/mixins/append.js")).default,
  attrs,
  classes,
  clear,
  connect,
  find,
  handlers,
  hooks,
  insert,
  props,
  send,
  style,
  tab,
  text,
  vars,
  (parent, config) => {
    return class extends parent {
      constructor() {
        super();
      }
    };
  },
];

export const registry = new (class {
  #_ = {
    registry: new Map(),
  };

  add({ tag, tree, ...config }, ...mixins) {
    tag = `rbs-${tag}`;

    standard.forEach((mixin) => mixins.unshift(mixin));

    const cls = mixin(config, ...mixins);

    customElements.define(tag, cls);
    this.#_.registry.set(tag, cls);

    if (import.meta.env.DEV) {
      console.info("Registered component with tag:", tag);
    }

    return factory(cls, tree);
  }
})();

function factory(cls, tree) {
  return (...args) => {
    const instance = new cls();

    instance.__new__?.(tree && tree());

    const updates =
      args.find(
        (a, i) =>
          i < 2 &&
          typeof a === "object" &&
          !(a instanceof Node) &&
          typeof a !== "function" &&
          !Array.isArray(a)
      ) || {};

    if (updates.parent && instance.parentElement !== updates.parent) {
      updates.parent.append(instance);
    }

    return instance.classes
      .add(args.find((a, i) => !i && typeof a === "string"))
      .update(updates)
      .append(
        ...args.filter(
          (a, i) =>
            a instanceof Node || (i && ["number", "string"].includes(typeof a))
        )
      )
      .hooks(...args.filter((a) => typeof a === "function"));
  };
}

function mixin(config, ...mixins) {
  let cls = HTMLElement;
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
}
