/* Factory for tags prop. */
export const tags = (parent, config, ...factories) => {
  const cls = class Tags extends parent {
    /* Return object, onto which ad hoc data can be attached. */
    get tags() {
      return this.#tags;
    }
    #tags = new (class {
      constructor(owner) {
        this.#owner = owner;
      }

      get owner() {
        return this.#owner;
      }
      #owner;
    })(this);
  };
  return cls;
};
