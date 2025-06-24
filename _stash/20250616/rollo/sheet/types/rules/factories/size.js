/* 
20250302 
src/rollo/sheet/types/rules/factories/size.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rules/factories/size.js
*/
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
