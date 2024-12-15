/* Factory for parent element management. */
export const parent = (parent, config, ...factories) => {
  const cls = class Parent extends parent {
    get parent() {
      return this.parentElement;
    }

    set parent(parent) {
      if (typeof parent === "function") {
        parent = parent.call(this);
      }
      if (parent === undefined) return;
      if (parent === this.parentElement) {
        return;
      }

      if (parent === null) {
        this.remove();
      } else {
        if (!(parent instanceof HTMLElement)) {
          throw new Error(`Invalid parent: ${parent}`);
        }
        parent.append(this);
      }
    }
  };
  return cls;
};
