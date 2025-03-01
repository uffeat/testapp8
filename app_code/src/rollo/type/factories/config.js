/* Implements config. */
export const config = (parent, config, ...factories) => {
  return class extends parent {
    static name = "config";

    /* Sets accessor props. Chainable.
    NOTE
    - Allows setting of data props with '_'-prefix.  */
    config(config = {}) {
      for (const [k, v] of Object.entries(config)) {
        if (!(k in this) && !k.startsWith('_')) {
          throw new Error(`Invalid key: ${k}`)
        }
        this[k] = v
      }
      return this
    }
  };
};
