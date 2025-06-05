export default (parent, config) => {
  return class extends parent {
    static __name__ = "slots";
    #_ = {};

    append(...children) {
      for (const child of children) {
        if (child.slot) {
          const slot = this.querySelector(`rollo-slot[name="${child.slot}"]`);
          if (!slot) {
            throw new Error(`Invalid slot: ${child.slot}`);
          }
          slot.append(child);
        } else {
          /* Could use 'super', but this is the safer way */
          Element.prototype.append.call(this, child);
        }
      }

      return this;
    }
  };
};
