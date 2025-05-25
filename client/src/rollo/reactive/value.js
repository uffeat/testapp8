/* 
20250331
src/rollo/reactive/value.js/
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/reactive/value.js
import { Reactive } from "rollo/reactive/value";
const { Reactive } = await import("rollo/reactive/value.js");
*/

import { is_callable } from "@/rollo/tools/is/is_callable.js";

/* Main responsibilities:
- Retrieve current and previous.
- Retrieve/set detail, name and owner.
- Add/remove effects.
- Update current in a way that
  - diagnoses change
  - updates current and previous, if change
  - notifies effects with change info, if change. */
export class Type {
  #current;
  #detail = {};
  #effects;
  #name = null;
  #owner = null;
  #previous;
  #registry = new Map();
  constructor() {
    const owner = this;
    /* Declare 'Effects' in constructor to enable access to private fields */
    this.#effects = new (class Effects {
      #max = 5;

      /* Returns max allowed effects. */
      get max() {
        return this.#max;
      }

      /* Sets max allowed effects. */
      set max(max) {
        this.#max = max;
      }

      /* Returns number of registered effects. */
      get size() {
        return owner.#registry.size;
      }

      /* Adds and returns effect. */
      add(effect, ...args) {
        /* Protect against memory leaks */
        if (
          import.meta.env.DEV &&
          typeof this.max === "number" &&
          this.size >= this.max
        ) {
          console.error(`Too many effects registered on:`, owner);
        }

        /* Parse args */
        const condition = (() => {
          const callable = args.find((a) => is_callable(a));
          if (callable) return callable;
          const array = args.find((a) => Array.isArray(a));
          if (array) return ({ current }) => [...array].includes(current);
        })();
        const options = (() => {
          const options = args.find(
            (a) => typeof a === "object" && !is_callable(a) && !Array.isArray(a)
          );
          return options ? { ...options } : {};
        })();

        if (options.once) {
          const _effect = effect;
          effect = (change) => {
            const result = _effect.call(owner, change);
            change.owner.effects.remove(change.self);
            return result;
          };
        }

        owner.#registry.set(effect, condition);

        if (options.run) {
          const change = Object.freeze({
            condition,
            current: owner.current,
            index: null,
            owner,
            previous: owner.previous,
            self: effect,
            session: null,
          });
          if (!condition || condition.call(change)) {
            effect.call(owner, change);
          }
        }

        return effect;
      }

      /* Tests, if effect is registered. */
      has(effect) {
        return owner.#registry.has(effect);
      }

      /* Removes effect. */
      remove(effect) {
        owner.#registry.delete(effect);
        return owner;
      }
    })();
  }

  __match__(value, other) {
    return value === other;
  }

  /* Returns current value. */
  get current() {
    return this.#current;
  }
  /* Sets current value reactively. */
  set current(current) {
    this.update(current);
  }

  /* Returns detail object.
  NOTE
  - Useful for managing related data 
    (organized alternative to data props). */
  get detail() {
    return this.#detail;
  }
  /* Sets detail. */
  set detail(detail) {
    this.#detail = detail;
  }

  /* Returns controller for effects. */
  get effects() {
    return this.#effects;
  }

  /* Returns name.
  NOTE
  - Useful for soft identification. */
  get name() {
    return this.#name;
  }
  /* Sets name. */
  set name(name) {
    this.#name = name;
  }

  /* Returns owner.
  NOTE
  - Can, e.g., be used to indirectly expand feature set;
    available from effects as 'owner.owner'. */
  get owner() {
    return this.#owner;
  }
  /* Sets owner. */
  set owner(owner) {
    this.#owner = owner;
  }

  /* Returns current value as-was before most recent change. */
  get previous() {
    return this.#previous;
  }

  /* Updates current reactively. Chainable. */
  update(value, { force = false } = {}) {
    if (typeof value === "function") {
      value = value.call(this, this);
    }
    if (force || !this.__match__(this.#current, value)) {
      this.#previous = this.#current;
      this.#current = value;
      this.#notify({ current: this.#current, previous: this.#previous });
    }
    return this;
  }

  /* Calls effects. 
  NOTE
  - Effects are invoked with 'call'. This draws from the behavior of native 
    event handlers, but more importantly, allows the use of non-function
    objects that implement a 'call' method. 
  - Each effect receives its own index. Likely only relevant for special cases, 
    but small implementation cost. 
  - false effect result prevents subsequent effects from being executed. 
    Likely only relevant for special cases, but small implementation cost.
    Risk of misuse only moderate, since effect functions normally do not 
    return anything.  */
  #notify({ current, previous }) {
    const _change = {
      current,
      owner: this,
      previous,
      session: {},
    };
    let index = 0;
    for (const [effect, condition] of this.#registry.entries()) {
      let result;
      const change = Object.freeze({
        condition,
        index: ++index,
        self: effect,
        ..._change,
      });
      if (!condition || condition.call(change)) {
        result = effect.call(this, change);
      }
      if (result === false) break;
    }
  }
}

/* Returns reactive value object mostly suitable for primitive values. */
export const Reactive = (value, props, ...effects) => {
  const self = new Type();
  if (props) Object.entries(props).forEach(([k, v]) => (self[k] = v));
  effects.forEach((effect) => self.effects.add(effect));
  /* Update after registration of any effects, so that effects are triggered  */
  self.update(value);
  return self;
};

/* EXAMPLES

await (async () => {
  const { Reactive } = await import("rollo/reactive/value");

  component.button("btn.btn-primary", { parent: app }, (button) => {
    const state = Reactive(
      0,
      {},
      ({ current }) => (button.text = `Count: ${current}`)
    );
    button.on.click = () => ++state.current;
  });
})();



await (async () => {
  const { Reactive } = await import("rollo/reactive/value");
  const state = Reactive(42)
  state.effects.add(({current, owner, self, previous}) => {
    console.log("Change from", previous, 'to', current)
  })
  state.current = 42
  state.current = 43
})();

*/
