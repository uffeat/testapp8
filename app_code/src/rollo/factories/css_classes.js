import { state } from "rollo/factories/state";
import { constants } from "rollo/constants";
import { camel_to_kebab_css } from "rollo/utils/case";



/*
TODO css_classes.remove/css_classes.has
*/

/* Factory for all web components. */
export const css_classes = (parent, config, ...factories) => {
  if (!factories.includes(state)) {
    throw new Error(`css_classes factory requires state factory`)
  }

  const cls = class CssClasses extends parent {
    #css_classes;
    constructor(...args) {
      super(...args);
      const component = this;
      this.#css_classes = new (class {
        /* Adds one or more css classes.  
        args can be:
        - Individual css class names
        - String with multiple css class names separated by '.'
        - Arrays of css class names
        undefined values are ignored to support iife's. 
        Chainable. */
        add = (...args) => {
          for (const arg of args) {
            if (arg === undefined) {
              continue;
            }
            if (arg.length === 0) {
              continue;
            }

            if (Array.isArray(arg)) {
              component.classList.add(
                ...arg.filter((c) => c).map((c) => camel_to_kebab_css(c))
              );
            } else if (typeof arg === "string") {
              let class_string = arg;
              if (class_string.startsWith(constants.STATE)) {
                component.$[`${class_string}`] = true
                continue

              }
              if (class_string.startsWith(constants.CSS_CLASS)) {
                class_string = class_string.slice(constants.CSS_CLASS.length)
              }

              component.classList.add(
                ...class_string
                  .split(".")
                  .filter((c) => c)
                  .map((c) => camel_to_kebab_css(c))
              );
            } else {
              throw new Error(`Invalid arg: ${arg}`);
            }
          }
          return component;
        };
      })();
    }

    get css_classes() {
      return this.#css_classes;
    }
  };
  return cls;
};
