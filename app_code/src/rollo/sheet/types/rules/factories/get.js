import { Rule } from "@/rollo/sheet/types/rule/rule";

export const get = (parent, config, ...factories) => {
  return class extends parent {
    static name = "get";

    /* Returns wrapped rule.
    NOTE
    - */
    get(header) {
      const key = this.__dict__.signature.key;

      let rule = this.__dict__.registry.get(header) || null;
      if (!rule) {
        /* Check if rule implemented, but not registered */
        const native = [...this.owner.cssRules].find((r) => r[key] === header);
        if (native) {
          rule = Rule(native);
        } else {
          const index = this.owner.insertRule(
            `${header} {}`,
            this.owner.cssRules.length
          );
          rule = Rule(this.owner.cssRules[index]);
        }
        /* Register */
        this.__dict__.registry.set(header, rule);
      }
      return rule;
    }
  };
};
