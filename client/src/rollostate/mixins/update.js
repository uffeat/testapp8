export default (parent, config) => {
  return class extends parent {
    #_ = {
      _change: {},
      _current: {},
      _previous: {},
      change: null,
      current: null,
      previous: null,
    };

    constructor() {
      super();
      const owner = this;
      this.#_.change = new (class {
        /* Returns number of items changed since most recent update. */
        get size() {
          return Object.keys(owner.#_._change).length;
        }
        entries() {
          return Object.entries(owner.#_._change);
        }
        get(key) {
          return owner.#_._change[key];
        }
        keys() {
          return Object.keys(owner.#_._change);
        }
        values() {
          return Object.values(owner.#_._change);
        }
      })();
      this.#_.current = new (class {
        entries() {
          return Object.entries(owner.#_._current);
        }
        get(key) {
          return owner.#_._current[key];
        }
      })();
      this.#_.previous = new (class {
        entries() {
          return Object.entries(owner.#_._previous);
        }
        get(key) {
          return owner.#_._previous[key];
        }
      })();
    }

    get change() {
      return this.#_.change;
    }
    get current() {
      return this.#_.current;
    }
    get previous() {
      return this.#_.previous;
    }

    //

    /* */
    update(updates = {}) {
      const change = Object.entries(updates).filter(
        ([k, v]) => v !== this.#_._current[k]
      );

      change.forEach(([k, v]) => {
        if (v === undefined) {
          this.#_._previous[k] = v;
          delete this.#_._current[k];
        } else {
          this.#_._previous[k] = this.#_._current[k];
          this.#_._current[k] = v;
        }
      });

      this.#_._change = Object.fromEntries(change);

      if (this.effects.size && change.length) {
        this.effects.notify(change);
      }
    }
  };
};
