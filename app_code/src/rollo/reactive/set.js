/* 
20250308
src/rollo/reactive/set.js/
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/reactive/set.js
import { Reactive } from "rollo/reactive/set.js";
const { Reactive } = await import("rollo/reactive/set.js");
*/

/* Main responsibilities:
- Retrieve current and previous.
- Retrieve/set detail, name and owner.
- Add/remove effects.
- Update current in a way that
  - diagnoses change
  - updates current and previous, if change
  - notifies effects with change info, if change. */
export class Type {
  #_current = Object.freeze([]);
  #current = new Set();
  #detail = {};
  #effects;
  #name = null;
  #owner = null;
  #previous = Object.freeze([]);
  #registry = new Set();
  constructor() {
    const owner = this;

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
    return this.#previous;
  }

  /* Returns number of values. */
  get size() {
    return this.#current.size;
  }

  /* Adds values reactively. Chainable. */
  add(...add) {
    return this.update({ add });
  }

  /* Removes all values reactively. Chainable. */
  clear() {
    return this.remove(...Array.from(this.#current.values()));
  }

  /* Removes values reactively. Chainable. */
  remove(...remove) {
    return this.update({ remove });
  }

  /* Adds/removes values reactively. Chainable. */
  update({ add, remove }) {
    /* Abort, if no changes */
    if (!add && !remove) return this;
    /* Interpret add/remove */
    if (typeof add === "function") {
      add = add.call(this, this);
    }
    if (typeof remove === "function") {
      remove = remove.call(this, this);
    }
    /* Diagnose additions */
    const added = Array.isArray(add)
      ? new Set([...add]).difference(this.#current)
      : null;
    /* Commit additions privately */
    if (added && added.size) {
      this.#current = this.#current.union(added);
    }
    /* Diagnose removals */
    const removed = Array.isArray(remove)
      ? this.#current.intersection(new Set([...remove]))
      : null;
    /* Commit removals privately */
    if (removed && removed.size) {
      this.#current = this.#current.difference(removed);
    }
    /* Abort, if no changes */
    if ((!added || !added.size) && (!removed || !removed.size)) return this;
    /* Commit changes publicly */
    this.#previous = Object.freeze(Array.from(this.#current.values()));
    this.#_current = Object.freeze(Array.from(this.#current.values()));
    /* Notify effects */
    this.#notify({
      current: this.current,
      previous: this.previous,
      added: added ? Object.freeze(Array.from(added)) : null,
      removed: removed ? Object.freeze(Array.from(removed)) : null,
    });
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
  #notify({ current, previous, added, removed }) {
    let index = 0
    for (const effect of this.#registry) {
      const result = effect.call(this, {
        added,
        current,
        index: ++index,
        owner: this,
        previous,
        removed,
        self: effect,
      });
      if (result === false) break;
    }
  }
}

/* Returns reactive object intended for flat unordered collections with unique 
values. */
export const Reactive = (add, props, ...effects) => {
  const instance = new Type();
  if (props) {
    Object.entries(props).forEach(([k, v]) => (instance[k] = v));
  }
  effects.forEach((effect) => instance.effects.add(effect));
  if (add) {
    instance.update({ add });
  }
  return instance;
};



/* EXAMPLES

await (async () => {
  const { Reactive } = await import("rollo/reactive/set");

  component.button("btn.btn-primary", { parent: app }, (button) => {
    const state = Reactive(
      [0],
      {},
      ({ current }) => (button.text = `Count: ${current[0]}`)
    );
    button.on.click = () => {
      let count = state.current[0]
      state.update({remove: [count], add: [++count]})
    };
  });
})();



await (async () => {
  const { Reactive } = await import("rollo/reactive/set");
  const state = Reative([1, 2, 3])
  state.effects.add(({current, owner, self, previous, added, removed}) => {
    console.log("Change from", previous, 'to', current)
    console.log('added:', added)
    console.log('removed:', removed)
  })
  state.add(4)
  state.add(4, 1)
  state.remove(1, 3)
  state.clear()
  console.log('state.current:', state.current)
  console.log('state.previous:', state.previous)
  state.update({add: [8, 9, 10], remove: [9]})
  console.log('state.current:', state.current)
})();

*/