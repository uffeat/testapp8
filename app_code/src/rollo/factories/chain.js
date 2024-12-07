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
    chain. Useful, when super is not enough. 
    NOTE
    Before using this feature, consider if
    - a super-based alternative could be conceived
    - a composition-based solution could be used instead.
    */
    get chain() {
      return this.#chain;
    }
    #chain = (() => {
      const chain = Object.fromEntries(
        this.__chain__.map((cls) => [cls.name, cls.prototype])
      );
      return new Proxy(this, {
        get(target, name) {
          const proto = chain[name];
          if (proto) {
            return proto;
          } else {
            throw new Error(`Invalid prototype name: ${name}`);
          }
        },
      });
    })();
  };
  return cls;
};
