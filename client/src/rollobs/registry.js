/* 
const { registry } = await use("@/rollobs/registry.js");
v.0.1
20200528
*/

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
  /* Create shadow root and ensure that super gets called */
  result.unshift((parent, config) => {
    return class extends parent {
      constructor() {
        super();
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.innerHTML = `<slot></slot>`;
        }
      }
    };
  });
  return result;
})();

export const registry = new (class {
  /* Registers autonomous web component from mixins and returns component 
  factory that injects tree. Automatically adds standard mixins.
  Intended for Bootstrap-based components. However, to accommodate special 
  cases and for alternative uses, a shadow root is attached.  */
  add({ tag, tree, ...config }, ...mixins) {
    if (typeof tag === "object" && "url" in tag) {
      tag = tag.url.split("/").at(-2).replaceAll("_", "-");
    }
    tag = `rbs-${tag}`;

    mixins.push(...standard);

    const cls = mixin(config, ...mixins);
    customElements.define(tag, cls);
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
    /* Instantiate */
    instance.__new__?.(tree && tree());
    /* Harvest updates */
    const updates =
      args.find(
        (a, i) =>
          i < 2 &&
          typeof a === "object" &&
          !(a instanceof Node) &&
          typeof a !== "function" &&
          !Array.isArray(a)
      ) || {};
    /* Deal with special 'parent' item */
    if (updates.parent && instance.parentElement !== updates.parent) {
      updates.parent.append(instance);
    }
    /* Config and return instance */
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
