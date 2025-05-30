/* 
const { registry } = await use("@/rollobs/registry.js");
v.1.0
20250530
*/


/* Tree mixin */

const { Args } = await use("@/rollocomponent/tools/args.js");
const { State } = await use("@/rollobs/tools/state.js");

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
    "host",
    "insert",
    "key",
    "parent",
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
      #_ = {};
      constructor() {
        super();
        /* Handle shadow */
        if (!this.shadowRoot) {
          this.attachShadow({ mode: "open" });
          this.shadowRoot.innerHTML = `<slot></slot>`;
        }
        /* Add state */
        this.#_.state = State(this);
      }

      /* Returns state controller. */
      get state() {
        return this.#_.state;
      }
    };
  });
  return result;
})();

export const registry = new (class {
  /* Registers autonomous web component from mixins and returns component 
  factory.
  - Adds standard mixins.
  - Injects tree.
  - Sets up reactivity.
  - Intended for ligt-DOM-first components. However, to accommodate special 
    cases and for alternative uses, a shadow root is attached. */
  add({ config = {}, effects, tag, tree }, ...mixins) {
    if (typeof tag === "object" && "url" in tag) {
      tag = tag.url.split("/").at(-2).replaceAll("_", "-");
    }
    tag = `rbs-${tag}`;

    mixins.push(...standard);

    const cls = mix(config, ...mixins);

    customElements.define(tag, cls);
    if (import.meta.env.DEV) {
      console.info("Registered component with tag:", tag);
    }

    return factory(cls, tree, effects);
  }
})();

/* Returns component factory function. */
function factory(cls, tree, effects) {
  return (...args) => {
    const instance = new cls();

    /* Set up reactivity */
    if (effects) {
      Object.entries(effects).forEach(([key, effect]) => {
        const component = tree.get(key);

        instance.state.effects.add(effect.bind(component));
      });
    }

    /* Parse args */
    args = new Args(args);

    /* Add CSS classes */
    instance.classes.add(args.classes);

    /* Use updates */
    instance.update(args.updates);

    /* Append children */
    instance.append(...args.children);

    /* Inject tree in a way that makes the tree available to mixins. */
    instance.__new__?.(tree);

    /* '__new__' is for factory use only, so remove */
    delete instance.__new__;

    /* Set up child elements */
    args.children.forEach((child) => {
      if (child instanceof Node) {
        child.setup?.({ parent: instance });
      }
    });

    return instance.hooks(...args.hooks);
  };
}

/* Returns class derived from HTMLElement and mixins. */
function mix(config, ...mixins) {
  let cls = HTMLElement;
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
}
