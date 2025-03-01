import { Effects } from "@/rollo/type/types/reactive/list/tools/effects";

export const effects = (parent, config, ...factories) => {
  return class extends parent {
    static name = "effects";

    #effects;

    __new__() {
      super.__new__ && super.__new__();

      if (this.config.effects) {
        this.#effects = Effects(this);
      }
    }

    /* Returns effects controller. */
    get effects() {
      return this.#effects;
    }
  };
};
