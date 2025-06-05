

export default (parent, config) => {
  return class extends parent {
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
          //super.append(child)
          //this.super_.append(child)
          Element.prototype.append.call(this, child)

          /*
          const slot = this.querySelector(`rollo-slot:not([name])`);
          if (!slot) {
            throw new Error(`Invalid slot: ${child.slot}`);
          }
          slot.append(child);
          */
        }
      }

      return this;
    }
  };
};
