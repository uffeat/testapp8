export const style = (parent, config, ...factories) => {
  return class extends parent {
    static name = "style";

    

    update(updates = {}) {
      super.update && super.update(updates);
      Object.entries(updates)
        .filter(([k, v]) => k in this.style && !(k in this))
        .forEach(([k, v]) => {
          this.style[k] = v;
        });
      return this;
    }
  };
};
