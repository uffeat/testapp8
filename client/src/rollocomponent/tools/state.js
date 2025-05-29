class _State {
  #_ = {
    _: {
      /* Deep stores */
      current: {},
      previous: {},
    },
    /* Effects registry */
    registry: new Map(),
    /* Initial exposed stores */
    change: Object.freeze({}),
    current: Object.freeze({}),
    previous: Object.freeze({}),
    /* Returns unique session id */
    session: (() => {
      let s = 0;
      return () => s++;
    })(),
  };

  constructor({ owner }) {
    this.#_.owner = owner;

    const state = this;
    this.#_.effects = new (class {
      get size() {
        return state.#_.registry.size
      }


      add(effect, ...keys) {
        /* Infer any condition function */
        const condition = keys.length
          ? (change) => {
              for (const key of Object.keys(change)) {
                if (keys.includes(key)) return true;
              }
              return false;
            }
          : null;
        /* Register */
        state.#_.registry.set(effect, condition);
        /* Run */
        if (!condition || condition(state.current)) {
          effect(state.current)
        }
        /* Make chainable with respect to owner */
        return state.owner
      }
    })();
  }

  /* Retuns changes from most recent update. */
  get change() {
    return this.#_.change;
  }

  /* Retuns current data. */
  get current() {
    return this.#_.current;
  }

  /* Retuns effects controller. */
  get effects() {
    return this.#_.effects;
  }

  /* Retuns owner. */
  get owner() {
    return this.#_.owner;
  }

  /* Returns data as-was before most recent update. */
  get previous() {
    return this.#_.previous;
  }

  /* Updates data and notifies effects, if changes. Chainable with respect to owner. */
  update(updates = {}) {
    /* Infer change entries */
    const change = Object.entries(updates).filter(
      ([k, v]) => v !== this.#_._.current[k]
    );
    /* Update deep stores from change entries */
    change.forEach(([k, v]) => {
      if (v === undefined) {
        this.#_._.previous[k] = v;
        /* NOTE Important convention: undefined deletes */
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

    if (this.effects.size && change.length) {
      this.#notify();
    }

    return this.owner;
  }

  #notify() {
    const session = this.#_.session();

    const args = [
      this.change,
      {
        current: this.current,
        previous: this.previous,
        session: this.#_.session(),
      },
    ];
  }
}

const State = ({ owner }) => {
  const instance = new _State({ owner });

  return instance;
};
