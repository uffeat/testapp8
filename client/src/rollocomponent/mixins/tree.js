export default (parent, config) => {
  return class extends parent {
   

    __new__() {
      super.__new__?.();

      if (this.constructor.tree) {
        const tree = this.constructor.tree();
        if (Array.isArray(tree)) {
          this.append(...tree);
        } else {
          this.append(tree);
        }
      }
    }
  };
};