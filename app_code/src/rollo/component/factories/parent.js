export const parent = (parent, config, ...factories) => {
  return class extends parent {
    static name = "parent";

    get parent() {
      return this.parentElement;
    }
    set parent(parent) {
      if (parent) {
        if (parent !== this.parentElement) {
          parent.append(this)
        }
      } else {
        this.remove()
      }
    }
   
  };
};
