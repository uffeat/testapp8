import { constants } from "rollo/constants";


/* Base factory for all web components. */
export const css_classes = (parent, config, ...factories) => {
  const cls = class CssClasses extends parent {
    constructor(...args) {
      super(...args);
    }

    /* */
    get css_classes() {
      return this.#css_classes;
    }
    #css_classes = new (class {
      /* Adds one or more css classes.  
      args can be:
      - Individual css class names
      - functions
      - String(s) with multiple css class names separated by '.'
      undefined values are ignored to support iife's. 
      Chainable. */
      #owner;
      constructor(owner) {
        this.#owner = owner;
      }

      add = (...args) => {
        this.#handle("add", ...args);
        return this.#owner;
      };

      has = (css_class) => {
        return this.#owner.classList.contains(css_class);
      };

      remove = (...args) => {
        this.#handle("remove", ...args);
        return this.#owner;
      };

      #handle = (action, ...args) => {
        for (let arg of args) {
          if (typeof arg === "function") {
            arg = arg.call(this.#owner);
          }
          if (arg === undefined) {
            continue;
          }
          if (typeof arg !== "string") {
            throw new Error(`Invalid css_classes argument: ${arg}`);
          }
          if (arg.length === 0) {
            continue;
          }
          if (arg.startsWith(constants.STATE)) {
            this.#owner.$[`${arg}`] = true;
            continue;
          }
          if (arg.startsWith(constants.CSS_CLASS)) {
            arg = arg.slice(constants.CSS_CLASS.length);
          }
          this.#owner.classList[action](...arg.split("."));
        }
      };
    })(this);

    /*
    TODO
    call
    */

    /* Updates css classes. Returns unhandled updates. */
    update(updates = {}) {
      if (super.update) {
        updates = super.update(updates);
      }

      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_CLASS))
        .forEach(([key, value]) =>
          this.css_classes[value ? "add" : "remove"](key)
        );

      return Object.fromEntries(
        Object.entries(updates).filter(
          ([key, value]) => !key.startsWith(constants.CSS_CLASS)
        )
      );
    }
  };
  return cls;
};
