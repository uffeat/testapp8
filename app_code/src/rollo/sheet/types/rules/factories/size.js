export const size = (parent, config, ...factories) => {
  return class extends parent {
    static name = "size";

    /* Returns number of top-level rules. */
    size() {
      const type = this.__dict__.signature.type
      return [...this.owner.cssRules].filter((r) => r instanceof type)
        .length;
    }
  };
};
