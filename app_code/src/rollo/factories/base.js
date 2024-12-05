import { constants } from "rollo/constants";
import { check_factories } from "rollo/utils/check_factories";
import { Reactive } from "rollo/factories/reactive";
import { attribute, css_classes } from "rollo/factories/__factories__";

/* Factory that coordinates multipe other factories, adds reactive features
ans exposes super for external access. also ensure super call in constructor. */
export const base = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, css_classes], factories);

  const cls = class Base extends parent {
    constructor() {
      super();
    }

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);

      /* Identify as web component. */
      this.attribute.webComponent = true;

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

    /* Returns controller for managing effects. */
    get effects() {
      return this.#reactive.effects;
    }

    /* Exposes reactive instance for full access to Reactive features. */
    get reactive() {
      return this.#reactive;
    }
    /* NOTE For a cleaner encapsulation, reactive features are provided by 
    composition (rather than using the reactive factory). 
    However, the '$' and 'effects' props are surfaced, and reactive.update is 
    called inside 'update' to provide as dx as if the reactive factory has been used.
    This offers an optimal mix of composition safety and inheritance-like direct access. */
    #reactive = Reactive.create({ owner: this });

    /* Updates component. Chainable. */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Update reactive state */
      this.reactive.update(updates);
      return this;
    }
  };
  return cls;
};
