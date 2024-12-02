import { constants } from "rollo/constants";
import { camel_to_kebab, camel_to_kebab_css } from "rollo/utils/case";




/* Factory for all web components. */
export const update = (parent, config, ...factories) => {
  const cls = class Update extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Getter/setter interface for component-scoped css vars. */
    get __() {
      return this.#__;
    }
    #__ = new Proxy(this, {
      get(target, key) {
        return getComputedStyle(target).getPropertyValue(`--${key}`).trim();
      },
      set(target, key, value) {
        if (typeof value === "function") {
          value = value.call(target);
        }
        if (value === undefined) return true;
        if (value) {
          target.style.setProperty(`--${key}`, value);
        } else {
          target.style.removeProperty(`--${key}`);
        }
        return true;
      },
    });

    /* Getter/setter interface to attributes. */
    get attribute() {
      return this.#attribute;
    }
    #attribute = new Proxy(this, {
      get(target, key) {
        key = camel_to_kebab(key);
        if (!target.hasAttribute(key)) {
          return null;
        }
        const value = target.getAttribute(key);
        if (value === "") {
          return true;
        }
        const number = Number(value);
        if (typeof number === "number" && number === number) {
          return number;
        }
        return value;
      },
      set(target, key, value) {
        if (typeof value === "function") {
          value = value.call(target);
        }
        if (value === undefined) return true;
        key = camel_to_kebab(key);
        if ([false, null].includes(value)) {
          /* Remove attr */
          target.removeAttribute(key);
          return true;
        }
        if (["", true].includes(value)) {
          /* Set no-value attr */
          target.setAttribute(key, "");
          return true;
        }
        /* Set value attr */
        if (!["number", "string"].includes(typeof value)) {
          throw new Error(`Invalid attr value: ${value}`);
        }
        target.setAttribute(key, value);
        return true;
      },
    });

    /* Getter/setter interface to css classes. */
    get css() {
      return this.#css;
    }
    #css = new Proxy(this, {
      get(target, css_class) {
        return target.classList.contains(camel_to_kebab_css(css_class));
      },
      set(target, css_class, value) {
        if (typeof value === "function") {
          value = value.call(target);
        }
        if (value === undefined) return true;
        target.classList[value ? "add" : "remove"](camel_to_kebab_css(css_class));
        return true;
      },
    });

    /* Syntactic sugar for event handler registration. */
    get on() {
      return this.#on;
    }
    #on = new Proxy(this, {
      get() {
        throw new Error(`'on' is write-only.`);
      },
      set(target, type, handler) {
        target.addEventListener(type, handler);
        return true;
      },
    });

    /* Updates properties, attributes, css classes, css vars and handlers. */
    update({ attributes, css, ...updates } = {}) {
      
      
      /* Props */
      this.#update_properties(updates);
      
      
      /* Attributes */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.ATTRIBUTE))
        .forEach(
          ([key, value]) => (this.attribute[key.slice(constants.ATTRIBUTE.length)] = value)
        );
      this.#update_attributes(attributes);



      /* CSS classes */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_CLASS))
        .forEach(
          ([key, value]) => (this.css[key.slice(constants.CSS_CLASS.length)] = value)
        );
      this.#update_css(css);


      /* CSS vars */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_VAR))
        .forEach(
          ([key, value]) => (this.__[key.slice(constants.CSS_VAR.length)] = value)
        );

      
      /* Handlers */
      this.#add_handlers(updates);
    }

    /* Adds one or more event handlers from object. 
    Keys should be prefixed with 'on_'.
    undefined handlers are ignored to support iife's.
    */
    #add_handlers = (updates) => {
      if (updates) {
        Object.entries(updates)
          .filter(([key, value]) => value !== undefined && key.startsWith(constants.HANDLER))
          .forEach(([key, value]) =>
            this.addEventListener(key.slice(constants.HANDLER.length), value)
          );
      }
    };

    /* Updates one or more element attributes from object. 
    Items with undefined values are ignored to support iife's.
    Items with false values removes the attribute.
    Items with true values add no-value attribute. 
    Chainable. */
    #update_attributes = (attributes) => {
      if (attributes) {
        Object.entries(attributes)
          .filter(([key, value]) => value !== undefined)
          .forEach(([key, value]) => {
            const attr_key = camel_to_kebab(key);
            if (value === true) {
              this.setAttribute(attr_key, "");
            } else if ([false, null].includes(key)) {
              this.removeAttribute(attr_key);
            } else {
              this.setAttribute(attr_key, value);
            }
          });
      }
      return this;
    };

    /* Updates one or more css classes from object. 
    Items with undefined values are ignored to support iife's.
    Items with false values removes the css class.
    Items with true values adds the css class. 
    Camel-case keys are converted to kebab. 
    Chainable. */
    #update_css = (css) => {
      if (css) {
        if (Array.isArray(css) || typeof css === "string") {
          add_css.call(this, css);
        } else {
          Object.entries(css)
            .filter(([key, value]) => value !== undefined)
            .forEach(([key, value]) => {
              this.classList[value ? "add" : "remove"](camel_to_kebab_css(key));
            });
        }
      }
      return this;
    };

    /* Updates one or more props from object. 
    Keys with shorthand prefixed are ignored.
    Items with undefined values are ignored to support iife's.
    Items with '_'-prefixed keys are allowed.
    Items with keys that match a style key are added to the style object.
    Items with other invalid keys throws an error.
    Chainable. */
    #update_properties = (updates) => {
      if (updates) {
        Object.entries(updates)
          .filter(
            ([key, value]) =>
              value !== undefined &&
              !key.startsWith(constants.STATE) &&
              !key.startsWith(constants.ATTRIBUTE) &&
              !key.startsWith(constants.CSS_CLASS) &&
              !key.startsWith(constants.CSS_VAR) &&
              !key.startsWith(constants.HANDLER)
              
          )
          .forEach(([key, value]) => {
            if (key.startsWith("_")) {
              this[key] = value;
            } else if (key in this) {
              this[key] = value;
            } else if (key in this.style) {
              this.style[key] = value;
            } else {
              throw new Error(`Invalid key: ${key}`);
            }
          });
      }
      return this;
    };
  };
  return cls;
};
