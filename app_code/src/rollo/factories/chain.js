/* Base factory for all web components. */
export const chain = (parent, config, ...factories) => {
  const cls = class Chain extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Access to prototype chain. */
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
