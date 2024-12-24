/* TODO
- Move other methods to own factories
*/


/* Implements features related to batch updating with the 'update' method as the cornerstone. 
NOTE
- Other factories also implement specialized methods for in-place mutation. 
  However, such specialized methods in this factory work via 'update'. */
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    /* Sets all items to a provided value. Chainable. */
    reset(value) {
      this.update(
        Object.fromEntries(Object.entries(this).map(([k, v]) => [k, value]))
      );
      return this;
    }

    /* Mutates items as per provided function. Chainable. */
    transform(f) {
      this.update(Object.fromEntries(Object.entries(this).map(f)));
      return this;
    }

    /* Mutates items from provided 'update'. Chainable. */
    update(update) {
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
      /* Update */
      for (const [k, v] of Object.entries(update)) {
        if (v === '__') {
          /* NOTE By convention '__' values deletes. This is critical for other 
          methods! */
          delete this[k];
        } else {
          this[k] = v;
        }
      }

      return this;
    }
  };
};
