export default (parent, config) => {
  return class extends parent {
    #_ = {
      _current: {},
      _previous: {},
      $: null,
      change: Object.freeze({}),
      current: Object.freeze({}),
      previous: Object.freeze({}),
      session: (() => {
        let s = 0;
        return () => s++;
      })(),
    };

    constructor() {
      super();


      this.#_.$ = new Proxy(this, {
      get: (target, key) => {
        return target.#_.current[key];
      },
      set: (target, key, value) => {
        target.update({ [key]: value });
        return true;
      },
    });
    }

    get $() {
      return this.#_.$
    }

    /* Retuns changes from most recent update data */
    get change() {
      return this.#_.change;
    }

    get current() {
      return this.#_.current;
    }

    get previous() {
      return this.#_.previous;
    }

    /* Updates data and notifies effects, if changes. Chainable. */
    update(updates = {}) {
      const change = Object.entries(updates).filter(
        ([k, v]) => v !== this.#_._current[k]
      );

      change.forEach(([k, v]) => {
        if (v === undefined) {
          this.#_._previous[k] = v;
          /* NOTE Important convention: undefined deletes */
          delete this.#_._current[k];
        } else {
          if (
            !["boolean", "number", "string"].includes(typeof v) &&
            v !== null
          ) {
            console.warn("Invalid value:", v);
            throw new Error(`Invalid type.`);
          }

          this.#_._previous[k] = this.#_._current[k];
          this.#_._current[k] = v;
        }
      });

      this.#_.change = Object.freeze(Object.fromEntries(change));
      this.#_.current = Object.freeze({ ...this.#_._current });
      this.#_.previous = Object.freeze({ ...this.#_._previous });

      console.log("session", this.#_.session());

      if (this.effects.size && change.length) {
        const session = this.#_.session();

        this.effects.__call__(this.change, {
          current: this.current,
          previous: this.previous,
          session,
        });
      }
    }
  };
};
