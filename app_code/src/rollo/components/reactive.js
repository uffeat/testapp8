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

    call(...hooks) {
      const deffered = [];
      for (let hook of hooks) {
        if (typeof hook === "function") {
          hook = hook.call(this);
          if (typeof hook === "function") {
            deffered.push(hook);
            continue;
          }
        }
        if (hook === undefined) {
          continue;
        }
        if (Array.isArray(hook)) {
          this.call(...hook);
          continue;
        }
        if (
          hook instanceof HTMLElement ||
          ["number", "string"].includes(typeof hook)
        ) {
          this.append(hook);
          continue;
        }

        throw new Error(`Invalid hook: ${hook}`);
      }
      setTimeout(() => {
        for (const hook of deffered) {
          this.call(hook);
        }
      }, 0);
      return this;
    }

    update(updates = {}) {
      return super.update(updates);
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
