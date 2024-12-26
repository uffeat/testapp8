/* Implements clone method. */
export const clone = (parent, config, ...factories) => {
  return class clone extends parent {
    /* Returns shallow clone. */
    clone() {
      return this.__class__.create({ ...this });
    }
  };
};

export { clone as default };