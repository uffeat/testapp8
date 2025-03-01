import { camel_to_kebab } from "@/rollo/tools/text/case";

export const descendants = (parent, config, ...factories) => {
  return class extends parent {
    static name = "descendants";

    #descendants = new Descendants(this);

    get descendants() {
      return this.#descendants;
    }
  };
};

class Descendants {
  #name;
  #owner;

  constructor(owner) {
    this.#owner = owner;

    this.#name = new Proxy(this.owner, {
      get(target, name) {
        return target.querySelector(`[name="${name}"]`);
      },
    });
  }

  get name() {
    return this.#name;
  }

  /* Returns owner component. */
  get owner() {
    return this.#owner;
  }

  get(selector) {
    const elements = this.owner.querySelectorAll(selector);
    if (elements.length === 0) {
      return null;
    } else if (elements.length === 1) {
      return elements[0];
    }
    return [...elements];
  }
}
