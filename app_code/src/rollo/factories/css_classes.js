import { constants } from "rollo/constants";
import { camel_to_kebab_css } from "rollo/utils/case";

/* Factory with enhanced features for controlling css classes. */
export const css_classes = (parent, config, ...factories) => {
  const cls = class CssClasses extends parent {
    created_callback(...args) {
      super.created_callback && super.created_callback(...args);
      /* Add css classes from CSS_CLASS-prefixed strings */
      args
        .filter(
          (arg) =>
            typeof arg === "string" && arg.startsWith(constants.CSS_CLASS)
        )
        .forEach((arg) => this.css_classes.add(arg));
    }

    /* Returns prop-like getter/setter interface to css class. 
    Supports camel case. */
    get css_class() {
      return this.#css_class;
    }
    #css_class = new Proxy(this, {
      get(target, css_class) {
        return target.classList.contains(camel_to_kebab_css(css_class));
      },
      set(target, css_class, value) {
        if (typeof value === "function") {
          value = value.call(target);
        }
        if (value === undefined) return true;
        target.classList[value ? "add" : "remove"](
          camel_to_kebab_css(css_class)
        );
        return true;
      },
    });

    /* Returns a classList controller that allows control of css classes 
    from '.'-strings and function values. */
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

          if (arg.startsWith(constants.CSS_CLASS)) {
            arg = arg.slice(constants.CSS_CLASS.length);
          }
          this.#owner.classList[action](...arg.split("."));
        }
      };
    })(this);

    /* Updates component. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Update css classes */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_CLASS))
        .forEach(([key, value]) =>
          this.css_classes[value ? "add" : "remove"](key)
        );
      return this;
    }
  };
  return cls;
};