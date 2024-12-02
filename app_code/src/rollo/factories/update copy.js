import { constants } from "rollo/constants";
import { camel_to_kebab, camel_to_kebab_css } from "rollo/utils/case";
import { css_classes } from "rollo/factories/css_classes";



/* Factory for all web components. */
export const update = (parent, config, ...factories) => {
  if (!factories.includes(css_classes)) {
    throw new Error(`update factory requires css_classes factory`);
  }

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
        target.classList[value ? "add" : "remove"](
          camel_to_kebab_css(css_class)
        );
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
        if (handler === undefined) return true;
        target.addEventListener(type, handler);
        return true;
      },
    });

    /* Updates properties, attributes, css classes, css vars and handlers. */
    update({ attributes, css, ...updates } = {}) {
      /* Props */
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

      /* Attributes */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.ATTRIBUTE))
        .forEach(
          ([key, value]) =>
            (this.attribute[key.slice(constants.ATTRIBUTE.length)] = value)
        );
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          this.attribute[key] = value;
        });
      }

      /* CSS classes */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_CLASS))
        .forEach(
          ([key, value]) =>
            (this.css[key.slice(constants.CSS_CLASS.length)] = value)
        );
      if (css) {
        if (Array.isArray(css) || typeof css === "string") {
          this.css_classes.add(css);
        } else {
          Object.entries(css)
            .filter(([key, value]) => value !== undefined)
            .forEach(([key, value]) => {
              this.css[key] = value;
            });
        }
      }

      /* CSS vars */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_VAR))
        .forEach(
          ([key, value]) =>
            (this.__[key.slice(constants.CSS_VAR.length)] = value)
        );

      /* Handlers */
      Object.entries(updates)
        .filter(
          ([key, value]) =>
            value !== undefined && key.startsWith(constants.HANDLER)
        )
        .map(([key, value]) => [key.slice(constants.HANDLER.length), value])
        .forEach(([key, value]) => (this.on[key] = value));
    }
  };
  return cls;
};
