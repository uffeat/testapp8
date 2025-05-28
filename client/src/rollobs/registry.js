

const standard = await (async () => {
  const result = [];
  for (const name of [
    "append",
    "attrs",
    "classes",
    "clear",
    "connect",
    "find",
    "handlers",
    "hooks",
    "insert",
    "props",
    "send",
    "style",
    "tab",
    "text",
    "vars",
  ]) {
    result.unshift((await use(`@/rollocomponent/mixins/${name}.js`)).default);
  }
  /* Ensure that super gets called */
  result.unshift((parent, config) => {
    return class extends parent {
      constructor() {
        super();
      }
    };
  });
  return result;
})();

/*
const standard = [
  (await use("@/rollocomponent/mixins/append.js")).default,
  (await use("@/rollocomponent/mixins/attrs.js")).default,
  (await use("@/rollocomponent/mixins/classes.js")).default,
  (await use("@/rollocomponent/mixins/clear.js")).default,
  (await use("@/rollocomponent/mixins/connect.js")).default,
  (await use("@/rollocomponent/mixins/find.js")).default,
  (await use("@/rollocomponent/mixins/handlers.js")).default,
  (await use("@/rollocomponent/mixins/hooks.js")).default,
  (await use("@/rollocomponent/mixins/insert.js")).default,
  (await use("@/rollocomponent/mixins/props.js")).default,
  (await use("@/rollocomponent/mixins/send.js")).default,
  (await use("@/rollocomponent/mixins/style.js")).default,
  (await use("@/rollocomponent/mixins/tab.js")).default,
  (await use("@/rollocomponent/mixins/text.js")).default,
  (await use("@/rollocomponent/mixins/vars.js")).default,
  // Ensure that super gets called
  (parent, config) => {
    return class extends parent {
      constructor() {
        super();
      }
    };
  },
];
*/

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

/* Returns component factory function. */
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

/* Returns class derived from HTMLElement and mixins. */
function mixin(config, ...mixins) {
  let cls = HTMLElement;
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
}
