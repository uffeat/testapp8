export const add = (parent, config, ...factories) => {
  return class extends parent {
    static name = "add";

    /* Adds rule to owner. 
    Creates, registers and returns wrapped rule.
    NOTE
    - If rule already registered, the registered rule is used. 
      This guards against rules with duplicate headers. */
    add(object) {
      const header = Object.keys(object)[0];
      const items = Object.values(object)[0];
      const rule = this.get(header);
      rule.update(items);
      return rule;
    }
   
  };
};
