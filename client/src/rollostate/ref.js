/*

*/

/* Reactive state utility for primitive values. */
export class Ref {
  #_ = {
    /* Effects registry */
    registry: new Map(),

    detail: {},

    session: null,
  };

  constructor({ initial, name, owner, subscription, transform } = {}) {
    this.#_.name = name;
    this.#_.owner = owner;
    this.#_.transform = transform;
    if (subscription) {
      this.bind(subscription);
    }

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
              !a.call &&
              !Array.isArray(a)
          ) || {};

        const condition = (() => {
          const values = (() => {
            const values = args.find((a) => Array.isArray(a));
            if (values) return (current) => values.includes(current);
          })();

          const custom = args.find(
            (a) => typeof a === "function" || (typeof a === "object" && a.call)
          );

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
            condition.call(ref, ref.current, {
              index: null,
              effect,
              ref,
            })
          ) {
            effect.call(ref, ref.current, {
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

  /* Returns subscription. */
  get subscription() {
    return this.#_.subscription;
  }

  /* NOTE 'transform' can be used to perform simply transformations, 
  but can also be used as a "reducer", e.g., when the Ref instance is 
  used as a 'State' effect, or when bound to a 'State' instance.  */

  /* Returns transform function (if set). */
  get transform() {
    return this.#_.transform;
  }

  /* Sets transform function. */
  set transform(transform) {
    this.#_.transform = transform;
  }

  /* Binds ref to subscription (typically a State instance). */
  bind(subscription, { run = false, transform } = {}) {
    if (transform) {
      this.#_.transform = transform;
    }
    if (this.#_.subscription) {
      this.#_.subscription.effects.remove(this.call);
    }
    if (subscription) {
      subscription.effects.add(this.call, { run });
    }
    this.#_.subscription = subscription;
    return this;
  }

  /* Updates data and notifies effects. 
  NOTE Allows Ref instances to be used as, e.g., effects/conditions for Ref 
  and State instances enabling advanced reactive chains. */
  call(...args) {
    /* Transform */
    if (this.transform) {
      const value = this.transform.call(this, ...args);
      if (value !== undefined) {
        this.update(value);
      }
    }
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
              condition.call(this, this.current, {
                effect,
                index,
                ref: this,
              })
            ) {
              effect.call(this, this.current, {
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
