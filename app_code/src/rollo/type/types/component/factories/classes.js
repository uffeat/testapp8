import { List } from "@/rollo/type/types/reactive/list/list";

export const classes = (parent, config, ...factories) => {
  return class extends parent {
    static name = "classes";

    #classes;

    __new__() {
      super.__new__ && super.__new__();
      this.#classes = List(null, { owner: this });
      this.#classes.effects.clear = null;
      this.#classes.effects.add((change) => {
        change.owner.owner.classList.add(...change.data.added);
        change.owner.owner.classList.remove(...change.data.removed);
      });
    }

    /* Returns controller for CSS classes */
    get classes() {
      return this.#classes;
    }
  };
};
