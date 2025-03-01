export const item = (parent, config, ...factories) => {
  return class extends parent {
    static name = "item";

    /* Returns object, from which individual items can be retrieved and set. */
    get item() {
      return this.#item;
    }
    #item = new Proxy(this, {
      get(target, key) {
        const priority = target.rule.style.getPropertyPriority(key);
        const value = target.rule.style.getPropertyValue(key);
        return priority ? `${value} !${priority}` : value;
      },
      set(target, key, value) {
        target.update({ [key]: value });
        return true;
      },
    });
  };
};
