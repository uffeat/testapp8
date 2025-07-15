/*

*/

//const { Shadow } = await use("/rollocomponent/tools/shadow.js");
const { Sheets } = await use("/rollosheet/");
const { component } = await use("/rollocomponent/component.js");
const { factory } = await use("/rollocomponent/tools/factory.js");
const { mix } = await use("/rollocomponent/tools/mix.js");
const { mixins } = await use("/rollocomponent/mixins/mixins.js");
const { registry } = await use("/rollocomponent/tools/registry.js");

const _mixins = Object.entries(mixins)
  .filter(([name, mixin]) => !["for_", "novalidation"].includes(name))
  .map(([name, mixin]) => mixin);

/* NOTE The native shadow root has limited DOM manipulation features,
therefore use the special Shadow component. */

const cls = class extends mix(HTMLElement, {}, ..._mixins) {
  static __key__ = "shadow-root";

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

export default (parent, config) => {
  return class extends parent {
    static __name__ = "shadow";

    #_ = {};

    constructor() {
      super();
      this.#_.shadow = Shadow(this);
    }

    get shadow() {
      return this.#_.shadow;
    }

    append(...children) {
      this.#check(...children);
      super.append(...children);
      return this;
    }

    prepend(...children) {
      this.#check(...children);
      super.prepend(...children);
      return this;
    }

    /* Checks slots */
    #check(...children) {
      children.forEach((child) => {
        if (!this.shadow.slots.has(child.slot)) {
          if (child.slot) {
            throw new Error(`No default slot.`);
          } else {
            throw new Error(`Invalid slot: ${child.slot}.`);
          }
        }
      });
    }
  };
};
