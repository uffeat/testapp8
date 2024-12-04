import { create_observed_attributes } from "rollo/utils/create_observed_attributes";

const create_uid = (() => {
  let count = 0;
  return () => {
    return `${count++}`;
  };
})();

export const uid = (parent, config, ...factories) => {
  const cls = class UId extends parent {
    static observedAttributes = create_observed_attributes(parent, "uid");
    #uid;
    constructor(...args) {
      super(...args);
      this.#uid = create_uid();
      this.setAttribute("uid", this.#uid);
    }

    attributeChangedCallback(name, previous, current) {
      super.attributeChangedCallback &&
        super.attributeChangedCallback(name, previous, current);
      if (name === "uid") {
        if (this.#uid !== current) {
          console.error(
            `'uid' cannot be changed. Reverting to original value.`
          );
          this.setAttribute("uid", this.#uid);
        }
      }
    }

    get uid() {
      return this.#uid;
    }
  };
  return cls;
};
