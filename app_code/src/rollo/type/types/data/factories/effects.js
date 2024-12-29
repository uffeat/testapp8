import { Effects } from "rollo/type/types/data/tools/effects";

/* Implements 'effects' getter. */
export const effects = (parent, config, ...factories) => {
  return class effects extends parent {
    /* Returns effects controller. */
    get effects() {
      return this.#effects;
    }
    #effects = Effects.create(this, () => this.data);
  };
};
