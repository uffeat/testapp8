import { type } from "@/rollo/type/type/type";
import { is_node } from "@/rollo/tools/is/is_node";
import { adopt, unadopt } from "@/rollo/sheet/tools/target";

export const shadow = (parent, config, ...factories) => {
  return class extends parent {
    static name = "shadow";

    #shadow = new Shadow(this);

    /* Returns shadow controller. */
    get shadow() {
      return this.#shadow;
    }
  };
};

/* Controller for shadow root. */
class Shadow {
  #owner;
  #root;
  #sheets;
  #slots;

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner component. */
  get owner() {
    return this.#owner;
  }

  /* Returns top-level container element inside shadow root. */
  get root() {
    return this.#root;
  }

  /* Returns sheets controller. */
  get sheets() {
    return this.#sheets;
  }

  /* Returns slots controller. */
  get slots() {
    return this.#slots;
  }

  /* Initializes shadow root. */
  create(...args) {
    this.owner.attachShadow({ mode: "open" });
    this.#root = type.create("div");
    this.#root.id = "root";
    this.owner.shadowRoot.append(this.#root);
    /* Initialize 'sheets' controller */
    this.#sheets = new Sheets(this.owner.shadowRoot);
    /* Initialize 'slots' controller */
    this.#slots = new Slots(this.root);

    const sheets = args.filter((s) => s instanceof CSSStyleSheet);
    this.sheets.add(...sheets);

    const children = args.filter((n) => is_node(n));
    this.root.append(...children);

    return this;
  }
}

/* Controller for managing constructed sheets. */
class Sheets {
  #owner;
  #registry = new Set();

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner (a document or a shadow root). */
  get owner() {
    return this.#owner;
  }

  /* Adopts sheets. Chainable. */
  add(...sheets) {
    for (const sheet of sheets) {
      if (this.has(sheet)) continue;
      adopt(this.owner, sheet);
      this.#registry.add(sheet);
    }
    return this;
  }

  /* Tests, if sheet adopted. */
  has(sheet) {
    return this.#registry.has(sheet);
  }

  /* Unadopts sheets. Chainable. */
  remove(...sheets) {
    for (const sheet of sheets) {
      if (!this.has(sheet)) continue;
      unadopt(this.owner, sheet);
      this.#registry.delete(sheet);
    }
    return this;
  }
}

/* Controller for slots. */
class Slots {
  #name;
  #owner;

  constructor(owner) {
    this.#owner = owner;

    this.#name = new Proxy(this, {
      get(target, name) {
        if (name === "_") {
          name = null;
        }
        return target.get(name);
      },
    });
  }

  /* Returns all slot elements in owner. */
  get all() {
    return [...this.owner.querySelectorAll("slot")];
  }

  get name() {
    return this.#name;
  }

  /* Returns owner (a shadow root or an element in shadow root). */
  get owner() {
    return this.#owner;
  }

  /* Returns owner slot element with a given name. 
  If falsy name, returns owner's nameless slot element.
  Returns null, if slot element not found. */
  get(name) {
    if (name) {
      return this.owner.querySelector(`slot[name="${name}"]`);
    } else {
      return (
        this.owner.querySelector(`slot:not([name])`) ||
        this.owner.querySelector(`slot[name=""]`)
      );
    }
  }

  /* Tests, if owner has a slot element with a given name. 
  If falsy name, tests, if shadow root has nameless a slot element. */
  has(name) {
    return !!this.get(name);
  }
}
