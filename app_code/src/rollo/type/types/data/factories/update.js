/* Implements update method. */
export const update = (parent, config, ...factories) => {
  return class update extends parent {


    get on_change() {
      return this.#on_change

    }
    set on_change(on_change) {
      on_change({ current: this.data, previous: this.data, owner: this })
      this.#on_change = on_change
    }
    #on_change





    /* Mutates items from provided 'update'. Chainable. */
    update(update, ...callbacks) {
      if (!update) return this;
      /* Allow 'update' types other than plain object
        NOTE
        Alternative 'update' types may fail, i.e.,
        - an array may not contain valid entries
        - a string may not contain json.
        However, to keep things lean, rather than implementing elaborate 
        checks/conversions, rely on "native failure modes" and disciplined usage. */
      if (Array.isArray(update)) {
        /* 'update' assumed an entries array */
        update = Object.fromEntries(update);
      } else if (typeof update === "string") {
        /* 'update' assumed a jsonable string */
        update = JSON.parse(update);
      }

      const current = {};
      const previous = {};

      /* Update */
      for (let [k, v] of Object.entries(update)) {
        /* Apply condition */
        if (this.condition) {
          if (!this.condition([k, v])) {
            continue;
          }
        }
        /* Transform */
        if (this.transformer) {
          const result = this.transformer([k, v]);
          if (result !== undefined) {
            v = result;
          }
        }

        /* Track changes */
        if (this.on_change || callbacks.length) {
          if (!this.__chain__.defined.has(k)) {
            if (v === undefined) {
              if (k in this) {
                current[k] = v;
                previous[k] = this[k];
              }
            } else {
              if (this[k] !== v) {
                current[k] = v;
                previous[k] = this[k];
              }
            }
          }
        }

        
        

        /* Update */
        if (v === undefined) {
          /* NOTE By convention undefined values deletes. This is critical for other 
            methods! */
          delete this[k];
        } else {
          this[k] = v;
        }
      }
      /* Call on_change and callbacks */
      if (Object.keys(current).length > 1) {
        if (this.on_change) {
          this.on_change({ current, previous, owner: this })
        }
        for (const callback of callbacks) {
          callback({ current, previous, owner: this });
        }
      }

      return this;
    }
  };
};
