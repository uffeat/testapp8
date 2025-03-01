export const object = (parent, config, ...factories) => {
  return class extends parent {
    static name = "object";

    /* Returns object representation of rules. */
    object() {
      const constructor = this.__dict__.signature.child.constructor;
      const type = this.__dict__.signature.type;
      let result = {};
      [...this.owner.cssRules]
        .reverse()
        .filter((r) => r instanceof type)
        .map((r) => constructor(r))
        .forEach((r) => (result = { ...r.object(), ...result }));
      return result;
    }
  };
};
