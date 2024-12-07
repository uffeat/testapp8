import { check_factories } from "rollo/utils/check_factories";
import {
  attribute,
} from "rollo/factories/__factories__";

/* Factory for name prop with one-way prop->attr reflection. */
export const name = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute], factories);
  const cls = class Name extends parent {
    #name
    get name() {
      return this.#name;
    }

    set name(name) {
      this.#name = name;
      this.attribute.name = name;
    }
  };
  return cls;
};
