import { Reactive } from "rollo/factories/reactive";
import { constants } from "rollo/constants";

/* Base factory for all web components. */
export const base = (parent, config, ...factories) => {
  const cls = class Base extends parent {
    constructor(...args) {
      super(...args);
      /* Identify as web component. */
      this.setAttribute("web-component", "");
    }

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);

      /* Append children */
      this.append(
        ...args.filter(
          (arg) =>
            arg instanceof HTMLElement ||
            typeof arg === "number" ||
            (typeof arg === "string" && !arg.startsWith(constants.CSS_CLASS))
        )
      );

      /* Show state as attribute */
      this.effects.add((data) => {
        for (let [key, { current, previous }] of Object.entries(data)) {
          if (key.startsWith(constants.NATIVE)) {
            continue;
          }
          key = `state-${key}`;
          if (["boolean", "number", "string"].includes(typeof current)) {
            this.attribute[key] = current;
          } else {
            this.attribute[key] = null;
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

    /* Returns controller for managing effects. */
    get effects() {
      return this.#reactive.effects;
    }

    /* Exposes reactive instance for full access to Reactive features. */
    get reactive() {
      return this.#reactive;
    }
    #reactive = Reactive.create();

    update(updates = {}) {
      super.update && super.update(updates);

      /* CSS vars */
      Object.entries(updates)
        .filter(([key, value]) => key.startsWith(constants.CSS_VAR))
        .forEach(
          ([key, value]) =>
            (this.__[key.slice(constants.CSS_VAR.length)] = value)
        );

      /* Reactive state */
      this.reactive.update(updates);

      return this;
    }
  };
  return cls;
};
