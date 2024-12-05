import { Component } from "rollo/component";
import { attribute } from "rollo/factories/attribute";

import { parent } from "rollo/factories/parent";
import { properties } from "rollo/factories/properties";
import { reactive } from "rollo/factories/reactive";
import { uid } from "rollo/factories/uid";

/*
TODO Consider (in a related component or util):
- effects by querySelector
- effects by events

*/

const factory = (parent) => {
  const cls = class DataReactive extends parent {
    #name;
    constructor(...args) {
      super(...args);
      this.style.display = "none";
    }

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);
      /* Show state as attribute */
      this.effects.add((data) => {
        for (let [key, { current, previous }] of Object.entries(data)) {
          key = `state-${key}`;
          if (["boolean", "number", "string"].includes(typeof current)) {
            this.attribute[key] = current;
          } else {
            this.attribute[key] = null;
          }
        }
      });
    }

    get name() {
      return this.#name;
    }

    /* For dom identification */
    set name(name) {
      this.#name = name;
      this.attribute.name = name;
    }
  };

  return cls;
};

Component.author(
  "data-reactive",
  HTMLElement,
  {},
  attribute,
  properties,
  reactive,
  uid,
  parent,
  factory
);
