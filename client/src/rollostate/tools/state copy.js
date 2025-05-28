/* 
20250308
src/rollo/reactive/dict.js/
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/reactive/dict.js
import { Reactive } from "rollo/reactive/dict.js";
const { Reactive } = await import("rollo/reactive/dict.js");
*/

/* TODO
- clear */

/* Main responsibilities:
- Retrieve current and previous.
- Retrieve/set detail, name and owner.
- Add/remove effects.
- Update current in a way that
  - diagnoses change
  - updates current and previous, if change
  - notifies effects with change info, if change. */
export class Type {
  #$;
  #_current = Object.freeze({});
  #current = {};
  #detail = {};
  #effects;
  #name = null;
  #owner = null;
  #_previous = Object.freeze({});
  #previous = {};
  #registry = new Set();
  constructor() {
    const owner = this;

    this.#$ = new Proxy(this, {
      get: (target, key) => {
        return owner.#current[key];
      },
      set: (target, key, value) => {
        owner.update({ [key]: value });
        return true;
      },
    });

    this.#effects = new (class {
      /* Returns number of registered effects. */
      get size() {
        return owner.#registry.size;
      }

      /* Adds and returns effect. */
      add(effect) {
        owner.#registry.add(effect);
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

  /* Returns object, from which an item value can be 
  retrieved or reactively updated. */
  get $() {
    return this.#$;
  }

  /* Returns current. */
  get current() {
    return this.#_current;
  }

  /* Returns detail.
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

  /* Returns current as-was before most recent change. */
  get previous() {
    return this.#_previous;
  }

  /* Returns number of items. */
  get size() {
    return Object.keys(this.#current).length;
  }

  /* Updates current reactively. Chainable. 
  NOTE
  - undefined value -> removes key. */
  update(items) {
    if (!items) return this;
    if (typeof items === "function") {
      items = items.call(this, this);
    }
    let change;
    /* Prepare containers for change diagnosis.
    NOTE
    - In principle redundant (can be inferred from current and previous),
      but convenient to have at hand in effects. */
    const added = {};
    const removed = {};
    const replaced = {};
    const updated = {};
    /* Diagnose change and commit to private */
    for (const [key, value] of Object.entries({ ...items })) {
      if (value === undefined) {
        if (key in this.#current) {
          removed[key] = this.#current[key];
          this.#previous[key] = this.#current[key];
          delete this.#current[key];
          change = true;
          continue;
        }
      }
      if (value !== this.#current[key]) {
        if (key in this.#current) {
          replaced[key] = this.#current[key];
          updated[key] = value;
        } else {
          added[key] = value;
        }
        this.#previous[key] = this.#current[key];
        this.#current[key] = value;
        change = true;
        continue;
      }
    }
    if (change) {
      /* Commit to public and notify effects */
      this.#_current = Object.freeze({ ...this.#current });
      this.#_previous = Object.freeze({ ...this.#previous });
      this.#notify({
        current: this.current,
        previous: this.previous,
        added: Object.keys(added).length ? Object.freeze(added) : null,
        removed: Object.keys(removed).length ? Object.freeze(removed) : null,
        replaced: Object.keys(replaced).length ? Object.freeze(replaced) : null,
        updated: Object.keys(updated).length ? Object.freeze(updated) : null,
      });
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
  #notify({ current, previous, added, removed, updated }) {
    let index = 0;
    for (const effect of this.#registry) {
      const result = effect.call(this, {
        added,
        current,
        index: ++index,
        owner: this,
        previous,
        removed,
        self: effect,
        updated,
      });
      if (result === false) break;
    }
  }
}

/* Returns reactive value object most suitable for plain flat objects. */
export const Reactive = (updates, props, ...effects) => {
  const instance = new Type();
  if (props) {
    Object.entries(props).forEach(([k, v]) => (instance[k] = v));
  }
  effects.forEach((effect) => instance.effects.add(effect));
  if (updates) {
    instance.update(updates);
  }
  return instance;
};


