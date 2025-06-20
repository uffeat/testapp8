/*
import { State } from "@/rollostate/state.js";
const { State } = await use("@/rollostate/state.js");
20250618
v.1.1
*/

/* Reactive state utility for flat object data with primitive values. */
export class State {
  #_ = {
    _: {
      /* Deep stores */
      current: {},
      previous: {},
    },
    /* Effects registry */
    registry: new Map(),
    /* Init exposed stores */
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
        return state.#_.registry.size;
      }

      /* Adds effect. */
      add(effect, ...args) {
        const options =
          args.find(
            (a) =>
              typeof a === "object" &&
              typeof a !== "function" &&
              !Array.isArray(a)
          ) || {};

        const condition = (() => {
          const keys_condition = (() => {
            const keys = args.find((a) => Array.isArray(a));
            if (keys) {
              const _keys = new Set(keys);
              return (change) =>
                !!_keys.intersection(new Set(Object.keys(change))).size;
            }
          })();

          const custom_condition = args.find((a) => typeof a === "function");

          if (keys_condition && !custom_condition) {
            return keys_condition;
          }

          if (!keys_condition && custom_condition) {
            return custom_condition;
          }

          if (keys_condition && custom_condition) {
            return (...args) => {
              if (!keys_condition(...args)) {
                return false;
              }
              return custom_condition(...args);
            };
          }
        })();

        const detail = { condition, once: options.once };

        state.#_.registry.set(effect, detail);
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
            condition(state.change, {
              index: null,
              effect,
              state,
            })
          ) {
            effect(state.change, {
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
        return state.#_.registry.get(effect);
      }

      /* Checks, if effect registered. */
      has(effect) {
        return state.#_.registry.has(effect);
      }

      /* Removes effect. */
      remove(effect) {
        state.#_.registry.delete(effect);
      }
    })();

    this.#_.$ = new Proxy(this, {
      get: (target, key) => {
        /* NOTE Safe to use deep store */
        return target.#_._.current[key];
      },
      set: (target, key, value) => {
        target.update({ [key]: value });
        return true;
      },
    });

    initial && this.update(initial);
  }

  /* Returns object, from with sigle current data items can be retrieved/set. */
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

  /* Returns data as-was before most recent update. */
  get previous() {
    return this.#_.previous;
  }

  /* Returns session id. */
  get session() {
    return this.#_.session;
  }

  /* Updates data and notifies effects,. Chainable. */
  update(updates = {}, { silent = false } = {}) {
    /* Infer change entries */
    const change = Object.entries(updates).filter(
      ([k, v]) => v !== this.#_._.current[k]
    );
    /* Update deep stores from change entries */
    change.forEach(([k, v]) => {
      if (v === undefined) {
        this.#_._.previous[k] = v;
        /* NOTE Important convention: undefined deletes;
        provides a way to remove entries and ensures that current 
        values are never undefined */
        delete this.#_._.current[k];
      } else {
        this.#_._.previous[k] = this.#_._.current[k];
        this.#_._.current[k] = v;
      }
    });
    /* Create exposed stores */
    this.#_.change = Object.freeze(Object.fromEntries(change));
    this.#_.current = Object.freeze({ ...this.#_._.current });
    this.#_.previous = Object.freeze({ ...this.#_._.previous });
    /* Call any effects, if change and not silent */
    if (!silent && this.effects.size && change.length) {
      this.#_.session = this.session === null ? 0 : this.session + 1;
      this.#_.registry
        .entries()
        .forEach(([effect, { condition, once }], index) => {
          if (
            !condition ||
            condition(this.change, {
              effect,
              index,
              state: this,
            })
          ) {
            effect(this.change, {
              effect,
              index,
              state: this,
            });

            if (once) {
              this.effects.remove(effect);
            }
          }
        });
    }
    return this;
  }
}
