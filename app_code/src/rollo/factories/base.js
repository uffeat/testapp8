import { Reactive } from "rollo/reactive";
import { constants } from "rollo/constants";
import { camel_to_kebab, camel_to_kebab_css } from "rollo/utils/case";

const STATE_CSS_CLASS = `${constants.STATE}${constants.CSS_CLASS}`;

/* Base factory for all web components. */
export const base = (parent, config, ...factories) => {
  /* Base factory that 'component' relies on */
  const cls = class Base extends parent {
    constructor(...args) {
      super(...args);
      /* Identify as web component. */
      this.setAttribute("web-component", "");
      /* Show state as attribute */
      this.effects.add((data) => {
        for (const [key, { current, previous }] of Object.entries(data)) {
          if (key.startsWith(constants.STATE)) {
            continue;
          }
          if (
            current === null ||
            ["boolean", "number", "string"].includes(typeof current)
          ) {
            this.attribute[`state-${key}`] = current;
          }
        }
      });
      /* Set up automatic prop updates from NATIVE-prefixed state */
      this.effects.add((data) => {
        const updates = {};
        for (const [key, { current, previous }] of Object.entries(data)) {
          if (key && key.startsWith(constants.NATIVE)) {
            updates[key.slice(constants.NATIVE.length)] = current;
          }
        }
        this.update(updates);
      });
    }

    

    /* Provides external access to super. */
    get __super__() {
      return this.#__super__;
    }
    #__super__ = new Proxy(this, {
      get: (target, key) => {
        return super[key];
      },
      set: (target, key, value) => {
        super[key] = value;
        return true;
      },
    });

    /* Returns an object, from which single state items can be retrieved 
    and set to trigger effects. */
    get $() {
      return this.#reactive.$;
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

    /* Getter/setter interface to css class. */
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

    /* */
    get css_classes() {
      return this.#css_classes;
    }
    #css_classes = new (class {
      /* Adds one or more css classes.  
      args can be:
      - Individual css class names
      - String with multiple css class names separated by '.'
      - Arrays of css class names
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

    /* Returns controller for managing effects. */
    get effects() {
      return this.#reactive.effects;
    }

    /* Exposes reactive instance for full access to Reactive features. */
    get reactive() {
      return this.#reactive;
    }
    #reactive = Reactive.create(null, { owner: this });

    /* Calls one or more hooks. 
    A hook is a function that is called bound the component.
    Qualified hook return values are appended to the component.
    Supports css classes (incl. reactive) and deferred hooks.
    Useful during component contruction to:
    - Add effects
    - Add handlers, potentially conditionally
    - Conditionally add one or more children
    undefined hooks are ignored to support iife's. 
    Chainable. 
    The idea is, that the method should be able to configure the component 
    with respect to configurations that a additive in nature 
    (children and css classes). */
    call(...hooks) {
      const deffered = []
      for (let hook of hooks) {
        if (typeof hook === "function") {
          hook = hook.call(this);
          if (typeof hook === "function") {
            deffered.push(hook)
            continue
          }
        }
        if (hook === undefined) {
          continue;
        }
        if (Array.isArray(hook)) {
          this.call(...hook);
          continue;
        }
        if (hook instanceof HTMLElement) {
          this.append(hook);
          continue;
        }
        if (typeof hook === "number") {
          this.append(hook);
          continue;
        }
        if (typeof hook === "string") {
          if (
            hook.startsWith(constants.CSS_CLASS) ||
            hook.startsWith(STATE_CSS_CLASS)
          ) {
            this.css_classes.add(hook);
          } else {
            this.append(hook);
          }
          continue;
        }
        throw new Error(`Invalid hook: ${hook}`)
      }
      setTimeout(() => {
        for (const hook of deffered) {
          this.call(hook)
        }
      }, 0)
      return this;
    }

    /* Updates properties, attributes, css classes, css vars, handlers and state,
    and runs any hooks. Chainable. 
    The idea is, that the method should be able to configure the component 
    completely. */
    update({hooks, ...updates} = {}) {
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

      /* CSS classes */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_CLASS))
        .forEach(([key, value]) =>
          this.css_classes[value ? "add" : "remove"](key)
        );

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

      /* Hooks */
      if (hooks) {
        if (!Array.isArray(hooks)) {
          throw new Error(`'hooks' should be an array.`)
        }
        this.call(...hooks)
      }

      /* Reactive state */
      const state = Object.fromEntries(
        Object.entries(updates)
          .filter(([key, value]) => key.startsWith(constants.STATE))
          .map(([key, value]) => [key.slice(constants.STATE.length), value])
      );
      this.reactive.update(state);
      return this;
    }

    

    

    


    

    
    
  };
  return cls;
};