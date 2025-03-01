export const items = (parent, config, ...factories) => {
  return class extends parent {
    static name = "items";

    get entries() {
      return Object.entries(this.current);
    }

    get keys() {
      return Object.keys(this.current);
    }

    get size() {
      return Object.keys(this.current).length;
    }

    get values() {
      return Object.values(this.current);
    }

    /* Tests, if key is in current data. */
    has(key) {
      return key in this.current;
    }
  };
};
