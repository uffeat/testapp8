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
        super.appendChild(this.#_.tree);
      }
    }

    append(...children) {
      for (const child of children) {
        if (!(child instanceof Node)) {
          super.append(child);
          continue;
        }

        if (child.slot) {
          const slot = this.querySelector(`rollo-slot[name="${child.slot}"]`);
          if (!slot) {
            throw new Error(`Invalid slot: ${child.slot}`);
          }
          slot.append(child);
          continue;
        }
        super.append(child);
      }

      return this;
    }
  };
};
