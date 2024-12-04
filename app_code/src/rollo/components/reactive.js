import { Component } from "rollo/component";
import { reactive } from "rollo/factories/reactive";
import { uid } from "rollo/factories/uid";

/*
TODO Consider:
- effects by querySelector
- effects by events

*/

const factory = (parent) => {
  const cls = class Reactive extends parent {
    static create = (...args) => {
      return new Reactive(...args);
    };
    #name;
    constructor(...args) {
      super(...args);
      this.style.display = "none";
    }

    get name() {
      return this.#name;
    }

    /* For dom identification */
    set name(name) {
      this.#name = name;
      if (name) {
        this.setAttribute("name", name);
      } else {
        this.removeAttribute("name");
      }
    }
  };

  return cls;
};

Component.author("data-reactive", HTMLElement, factory, reactive, uid);

// TODO fix: create

/* Expose Reactive to enable element instantiation with Reactive.create */
export const Reactive = Component.registry.get("data-reactive");
