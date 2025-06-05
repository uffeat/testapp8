export default (parent, config, ...mixins) => {
  return class extends parent {
    static __name__ = "super_";

    #super_;

    __new__() {
      super.__new__?.();

      const get_super = (key) => {
        return super[key];
      };

      const set_super = (key, value) => {
        super[key] = value;
      };

      this.#super_ = new Proxy(this, {
        get(target, key) {
          return get_super(key);
        },
        set(target, key, value) {
          set_super(key, value);
          return true;
        },
      });
    }

    /* Returns object, from which super items can be retrived/set. */
    get super_() {
      return this.#super_;
    }
  };
};