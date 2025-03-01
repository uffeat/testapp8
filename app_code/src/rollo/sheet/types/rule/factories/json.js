export const json = (parent, config, ...factories) => {
  return class extends parent {
    static name = "json";

    /* Returns json representation of rule. */
    json() {
      return JSON.stringify(this.object());
    }
  };
};
