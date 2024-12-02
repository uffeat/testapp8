import { Reactive } from "rollo/reactive";
import { update } from "rollo/factories/update";
import { constants } from "rollo/constants";

/* Factory for all web components. */
export const state = (parent, config, ...factories) => {
  if (!factories.includes(update)) {
    throw new Error(`state factory requires update factory`);
  }

  const cls = class State extends parent {
    constructor(...args) {
      super(...args);
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
            if (key.startsWith("__") && key.endsWith("__")) {
              this.attribute[key] = current;
            } else {
              this.attribute[`state-${key}`] = current;
            }
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
    #reactive = Reactive.create(null, { owner: this });

    /* Updates properties, attributes, css classes, css vars, handlers and state. 
    Chainable. */
    update({ attributes, css, ...updates } = {}) {
      super.update({ attributes, css, ...updates });
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
