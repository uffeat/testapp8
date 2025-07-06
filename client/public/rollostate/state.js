/*
const { State } = await use("@/rollostate/state.js");
20250620
v.1.2
*/

/* Reactive state utility for flat object data with primitive values. */
export class State {
  #_ = {
    _: {
      /* Deep stores */
      current: {},
      previous: {},
    },
    registries: {
      effects: new Map(),
    },
    /* Initial exposed stores */
    change: Object.freeze({}),
    current: Object.freeze({}),
    detail: {},
    previous: Object.freeze({}),
    session: null,
  };

  constructor({ initial, name, owner } = {}) {
    this.#_.name = name;
    this.#_.owner = owner;

    const state = this;

    this.#_.effects = new (class {
      /* Returns number of effects. */
      get size() {
        return state.#_.registries.effects.size;
      }

      /* Adds effect. */
      add(effect, ...args) {
        const options =
          args.find(
            (a) =>
              typeof a === "object" &&
              typeof a !== "function" &&
              !a.call &&
              !Array.isArray(a)
          ) || {};

        const condition = (() => {
          const keys = (() => {
            const keys = args.find((a) => Array.isArray(a));
            if (keys) {
              const _keys = new Set(keys);
              return (change) =>
                !!_keys.intersection(new Set(Object.keys(change))).size;
            }
          })();

          const custom = args.find(
            (a) => typeof a === "function" || (typeof a === "object" && a.call)
          );

          if (keys && !custom) return keys;

          if (!keys && custom) return custom;

          if (keys && custom)
            return (...args) => keys(...args) && custom(...args);
        })();

        const detail = { condition, once: options.once };

        state.#_.registries.effects.set(effect, detail);
        /* NOTE By storing 'detail' as a mutatable object, advanced (likely rare) 
        dynamic effect control is possible. Example:
        - An effect is added with a condition function.
        - The effect function does nothing, but the actual work is done in the 
          condition function.
        - The condition function receives 'effect' and 'state' and can 
          therefore access and mutate the stored detail object and hence 
          replace itself, like:
            const detail = state.effects.get(effect)
            detail.condition = (change) => { ... }
        */

        if (options.run) {
          if (
            !condition ||
            condition.call(state, state.change, {
              index: null,
              effect,
              state,
            })
          ) {
            effect.call(state, state.change, {
              effect,
              index: null,
              state,
            });
          }
        }

        return state;
      }

      /* Returns effect detail. */
      get(effect) {
        return state.#_.registries.effects.get(effect);
      }

      /* Checks, if effect registered. */
      has(effect) {
        return state.#_.registries.effects.has(effect);
      }

      /* Removes effect. */
      remove(effect) {
        state.#_.registries.effects.delete(effect);
      }
    })();

    this.#_.$ = new Proxy(this, {
      get: (target, k) => {
        /* NOTE Safe to use deep store */
        return target.#_._.current[k];
      },
      set: (target, k, v) => {
        target.update({ [k]: v });
        return true;
      },
    });

    initial && this.update(initial);
  }

  /* Returns object, from with single current data items can be retrieved/set. */
  get $() {
    return this.#_.$;
  }

  /* Returns changes from most recent update. */
  get change() {
    return this.#_.change;
  }

  /* Returns current data. */
  get current() {
    return this.#_.current;
  }

  /* Returns detail. */
  get detail() {
    return this.#_.detail;
  }

  /* Returns effects controller. */
  get effects() {
    return this.#_.effects;
  }

  /* Returns name. */
  get name() {
    return this.#_.name;
  }

  /* Returns owner. */
  get owner() {
    return this.#_.owner;
  }

  /* Returns data as-was before most recent change to individual items. */
  get previous() {
    return this.#_.previous;
  }

  /* Returns session id. */
  get session() {
    return this.#_.session;
  }

  /* Updates data and notifies effects,. Chainable. */
  update(updates = {}, { silent = false } = {}) {
    const change = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined) {
        this.#_._.previous[k] = this.#_._.current[k];
        change[k] = v;
        /* NOTE By convention, undefined deletes */
        delete this.#_._.current[k];
      } else if (v !== this.#_._.current[k]) {
        this.#_._.previous[k] = this.#_._.current[k];
        change[k] = v;
        this.#_._.current[k] = v;
      }
    }

    /* Create exposed stores */
    this.#_.change = Object.freeze(change);
    this.#_.current = Object.freeze({ ...this.#_._.current });
    this.#_.previous = Object.freeze({ ...this.#_._.previous });
    /* Call any effects, if change and not silent */
    if (!silent && this.effects.size && Object.keys(change)) {
      this.#_.session = this.session === null ? 0 : ++this.#_.session;
      let index = 0;
      for (const [
        effect,
        { condition, once },
      ] of this.#_.registries.effects.entries()) {
        if (
          !condition ||
          condition.call(this, this.change, {
            effect,
            index,
            state: this,
          })
        ) {
          effect.call(this, this.change, {
            effect,
            index,
            state: this,
          });

          if (once) {
            this.effects.remove(effect);
          }
        }
        ++index;
      }
    }
    return this;
  }
}
