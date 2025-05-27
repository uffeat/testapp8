import append from "@/rollocomponent/mixins/append.js";
import classes from "@/rollocomponent/mixins/classes.js";
import handlers from "@/rollocomponent/mixins/handlers.js";
import hooks from "@/rollocomponent/mixins/hooks.js";
import props from "@/rollocomponent/mixins/props.js";
import text from "@/rollocomponent/mixins/text.js";

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

    const mixins = [append, classes, handlers, hooks, props];

    if ("textContent" in ref) {
      mixins.push(text);
    }

    class cls extends mixin(base, {}, ...mixins) {
      constructor() {
        super();
        this.setAttribute("web-component", "");
      }
    }

    this.#_.registry.set(tag, cls);

    customElements.define(`native-${tag}`, cls, {
      extends: tag,
    });

    if (import.meta.env.DEV) {
      console.info("Registered component with tag:", tag);
    }

    return cls;
  }
})();

/* Returns component instance. */
export const component = new Proxy(
  {},
  {
    get: (_, tag) => {
      const instance = new (registry.get(tag))();
      return function (...args) {
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
                a instanceof Node ||
                (i && ["number", "string"].includes(typeof a))
            )
          ).hooks(...args.filter((a) => typeof a === 'function'))
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
