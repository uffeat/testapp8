/*
import Input from "@/components/form/input.js";
*/

import { State, author, base, component, mix, mixins } from "@/rollocomponent/__init__.js";
import input from "@/components/form/mixins/input.js";

const cls = class extends mix(base("input"), {}, input) {
static __key__ = 'rollo-input'


  #_ = {
    types: ["email", "numeric", "password", "search", "tel", "text", "url"],
  };

  constructor() {
    super();
  }

  __new__() {
    super.__new__?.();
  }

  /* Returns type. */
  get type() {
    return this.#_.type || "text";
  }

  /* Sets type. */
  set type(type) {
    if (!this.#_.types.includes(type)) {
      throw new Error(`Unsupported type: ${type}`);
    }
    this.#_.type = type;
    if (type === "numeric") {
      type = "text";
    }
    super.type = type;
  }

  __init__() {
    super.__init__?.();
  }
};

export default author(cls)


