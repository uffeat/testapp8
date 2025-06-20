/*
import { Ref } from "@/rollorstate/ref.js";
const { Ref } = await use("@/rollorstate/ref.js");
20250620
v.1.0
*/

/* Reactive state utility for primitive values. */
export class Ref {
  #_ = {
    /* Effects registry */
    registry: new Map(),

    detail: {},

    session: null,
  };

  constructor({ initial, name, owner } = {}) {
    this.#_.name = name;
    this.#_.owner = owner;

    const ref = this;

    this.#_.effects = new (class {
      /* Returns number of effects. */
      get size() {
        return ref.#_.registry.size;
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
          const values = (() => {
            const values = args.find((a) => Array.isArray(a));
            if (values) return (current) => values.includes(current);
          })();

          const custom = args.find((a) => typeof a === "function");

          if (values && !custom) return values;

          if (!values && custom) return custom;

          if (values && custom)
            return (...args) => values(...args) && custom(...args);
        })();

        const detail = { condition, once: options.once };

        ref.#_.registry.set(effect, detail);
        /* NOTE By storing 'detail' as a mutatable object, advanced (likely rare) 
        dynamic effect control is possible. Example:
        - An effect is added with a condition function.
        - The effect function does nothing, but the actual work is done in the 
          condition function.
        - The condition function receives 'effect' and 'ref' and can 
          therefore access and mutate the stored detail object and hence 
          replace itself, like:
            const detail = ref.effects.get(effect)
            detail.condition = (change) => { ... }
        */

        if (options.run) {
          if (
            !condition ||
            condition(ref.current, {
              index: null,
              effect,
              ref,
            })
          ) {
            effect(ref.current, {
              effect,
              index: null,
              ref,
            });
          }
        }

        return ref;
      }

      /* Returns effect detail. */
      get(effect) {
        return ref.#_.registry.get(effect);
      }

      /* Checks, if effect registered. */
      has(effect) {
        return ref.#_.registry.has(effect);
      }

      /* Removes effect. */
      remove(effect) {
        ref.#_.registry.delete(effect);
      }
    })();

    this.update(initial);
  }

  /* NOTE '$' is an alias for the 'current' prop and is provided for 
  approximate consistency with respect to of reactive types. */

  /* Returns current value. */
  get $() {
    return this.#_.current;
  }

  /* Sets current value. */
  set $(value) {
    this.update(value);
  }

  /* Returns current value. */
  get current() {
    return this.#_.current;
  }

  /* Sets current value. */
  set current(value) {
    this.update(value);
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

  /* Returns current value as-was before most recent update. */
  get previous() {
    return this.#_.previous;
  }

  /* Returns session id. */
  get session() {
    return this.#_.session;
  }

  /* Updates data and notifies effects. Chainable. */
  update(value, { silent = false } = {}) {
    /* Abort, if undefined - by convention and for approximate consistency 
    with respect to of reactive types. Also, convenient, when using iife's. */
    if (value === undefined) {
      return this;
    }
    if (this.#_.current !== value) {
      /* Update data */
      this.#_.previous = this.#_.current;
      this.#_.current = value;
      /* Call any effects, if not silent */
      if (!silent && this.effects.size) {
        this.#_.session = this.session === null ? 0 : this.session;
        this.#_.registry
          .entries()
          .forEach(([effect, { condition, once }], index) => {
            if (
              !condition ||
              condition(this.current, {
                effect,
                index,
                ref: this,
              })
            ) {
              effect(this.current, {
                effect,
                index,
                ref: this,
              });

              if (once) {
                this.effects.remove(effect);
              }
            }
          });
      }
    }

    return this;
  }
}
