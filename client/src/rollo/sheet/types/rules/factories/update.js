/* 
20250302 
src/rollo/sheet/types/rules/factories/update.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rules/factories/update.js
*/
export const update = (parent, config, ...factories) => {
  return class extends parent {
    static name = "update";

    /* Updates rules. Chainable. */
    update(updates = {}) {
      for (const [header, items] of Object.entries(updates)) {
        const rule = this.get(header);
        rule.update(items);
      }
      return this;
    }
  };
};
