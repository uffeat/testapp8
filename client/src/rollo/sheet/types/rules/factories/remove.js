/* 
20250302 
src/rollo/sheet/types/rules/factories/remove.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rules/factories/remove.js
*/
export const remove = (parent, config, ...factories) => {
  return class extends parent {
    static name = "remove";

    /* Removes rule by header. Chainable. */
    remove(header) {
      const key = this.__dict__.signature.key;
      const rule = this.__dict__.registry.get(header);
      if (rule) {
        /* Handle registered rule */
        const index = [...this.owner.cssRules].findIndex(
          (r) => r === rule.rule
        );
        this.owner.deleteRule(index);
        this.__dict__.registry.delete(header);
      } else {
        /* Handle unregistered rule */
        const index = this.index(header);
        if (index !== null) {
          this.owner.deleteRule(index);
        }
      }
      return this;
    }
  };
};
