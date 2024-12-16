import { Component } from "rollo/component";
import {
  attribute,
} from "rollo/factories/__factories__";

/* Factory for name prop with one-way prop->attr reflection. */
export const name = (parent, config, ...factories) => {
  /* Check factory dependencies */
  Component.factories.check([attribute], factories);
  const cls = class Name extends parent {
   
    get name() {
      return this.#name;
    }
    set name(name) {
      this.#name = name;
      this.attribute.name = name;
    }
    #name
  };
  return cls;
};
