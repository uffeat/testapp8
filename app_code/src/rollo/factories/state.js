import { Reactive } from "rollo/reactive";
import { update } from "rollo/factories/update";

const $ = "$";

/* Factory for all web components. */
export const state = (parent, ...factories) => {
  if (!factories.includes(update)) {
    throw new Error(`state factory requires update factory`)
  }


  const cls = class State extends parent {
    #set_connected;
    constructor(...args) {
      super(...args);

      console.log("state constructor"); ////

      this.#set_connected = this.reactive.protected.add("connected");
      /* Show state as data attribute */
      this.effects.add((data) => {
        for (const [key, { current, previous }] of Object.entries(data)) {
          if (key.startsWith($)) {
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
      /* Set up automatic prop updates from $-prefixed state */
      this.effects.add((data) => {
        const updates = {};
        for (const [key, { current, previous }] of Object.entries(data)) {
          if (key && key.startsWith($)) {
            updates[key.slice($.length)] = current;
          }
        }
        this.update(updates);
      });
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.#set_connected(true);
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.#set_connected(false);
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
          .filter(([key, value]) => key.startsWith($))
          .map(([key, value]) => [key.slice(1), value])
      );
      this.reactive.update(state);
      return this;
    }
  };
  return cls;
};
