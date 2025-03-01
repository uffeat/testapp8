export const name = (parent, config, ...factories) => {
  return class extends parent {
    static name = "name";

    get name() {
      return this.#name;
    }
    set name(name) {
      if (name) {
        this.setAttribute("name", name);
      } else {
        this.removeAttribute("name");
      }
      this.#name = name;
    }
    #name = null;
  };
};
