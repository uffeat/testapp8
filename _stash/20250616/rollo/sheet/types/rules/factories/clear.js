/* 
20250302 
src/rollo/sheet/types/rules/factories/clear.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rules/factories/clear.js
*/

export const clear = (parent, config, ...factories) => {
  return class extends parent {
    static name = "clear";

    /* Removes all rules. Chainable. */
    clear() {
      const key = this.__dict__.signature.key;
      const type = this.__dict__.signature.type;
      [...this.owner.cssRules]
          .filter((r) => r instanceof type)
          .forEach((r) => {
            this.owner.deleteRule(this.index(r[key]))
            this.__dict__.registry.delete(r[key]);
          });
      return this;
    }
  };
};
