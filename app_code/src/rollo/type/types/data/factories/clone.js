/* Implements clone method. */
export const clone = (parent, config, ...factories) => {
  return class clone extends parent {
    static name = 'clone'
    /* Returns shallow clone. */
    clone() {
      return this.__class__.create({ ...this });
    }
  };
};

