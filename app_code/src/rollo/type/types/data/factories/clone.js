import { type } from "rollo/type/type/type";

/* Implements clone method. */
export const clone = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'clone'
    /* Returns shallow clone. */
    clone() {
      return type.create('data', this.data)
    }
  };
};

