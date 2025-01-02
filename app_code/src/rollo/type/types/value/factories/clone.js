import { type } from "rollo/type/type/type";

/* Implements clone method. */
export const clone = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'clone'
    /* Returns clone. */
    clone() {
      return type.create('value', this.current)
    }
  };
};

