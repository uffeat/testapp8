/* Mixin for use with the 'tree' pattern.  */

export default (parent, config) => {
  return class extends parent {
    #_ = {};

    get tree() {
      return this.#_.tree;
    }

    __new__() {
      super.__new__?.();
      if (this.constructor.tree) {
        this.#_.tree = this.constructor.tree();
        super.append(this.#_.tree);
      }
    }

    append(...children) {
      for (const child of children) {
        if (child.slot) {
          const slot = this.querySelector(`rollo-slot[name="${child.slot}"]`);
          if (!slot) {
            throw new Error(`Invalid slot: ${child.slot}`);
          }
          slot.append(child);
        } else {
          const slot = this.querySelector(`rollo-slot:not([name])`);
          if (!slot) {
            throw new Error(`Invalid slot: ${child.slot}`);
          }
          slot.append(child);
        }
      }

      return this;
    }
  };
};
