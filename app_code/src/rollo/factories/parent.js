/* Factory for all web components. */
export const parent = (parent) => {
  const cls = class Parent extends parent {
    constructor(...args) {
      super(...args);
    }

    get parent() {
      return this.parentElement;
    }

    set parent(parent) {
      if (typeof parent === "function") {
        parent = parent.call(this);
      }
      if (parent === undefined) return;
      if (parent === null) {
        this.remove();
      } else if (this.parentElement !== parent) {
        parent.append(this);
      }
    }
  };
  return cls;
};
