export const index = (parent, config, ...factories) => {
  return class extends parent {
    static name = "index";

    /* Returns rule index by rule header. Returns null, if rule not found. */
    index(header) {
      const key = this.__dict__.signature.key
      const index = (
        [...this.owner.cssRules].findIndex(
          (r) => r[key] === header
        )
      );
      return (typeof index === 'number' && index >= 0) ? index : null
    }
  };
};
