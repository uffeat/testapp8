/* Implements '$' getter. */
export const $ = (parent, config, ...factories) => {
  return class $ extends parent {
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, key) => {
        return target[key];
      },
      set: (target, key, value) => {
        if (target.__chain__.defined.has(key)) {
          target[key] = value;
        } else {
          target.update({ [key]: value });
        }
        return true;
      },
    });
  };
};
