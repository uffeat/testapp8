/* Factory with features for accessing classes in prototype chain. */
export const chain = (parent, config, ...factories) => {
  const cls = class Chain extends parent {
    /* Provides external access to super. */
    get __super__() {
      return this.#__super__;
    }
    #__super__ = new Proxy(this, {
      get: (target, key) => {
        return super[key];
      },
      set: (target, key, value) => {
        super[key] = value;
        return true;
      },
    });

    /* Returns prop-like getter interface for access to classes in prototype 
    chain. */
    get chain() {
      return this.#chain;
    }
    #chain = Object.fromEntries(
      this.__chain__.map((cls) => [cls.name, cls.prototype])
    );
  };
  return cls;
};
