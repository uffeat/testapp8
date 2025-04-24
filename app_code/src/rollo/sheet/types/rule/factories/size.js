/* 
20250302 
src/rollo/sheet/types/rule/factories/size.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rule/factories/size.js
*/
export const size = (parent, config, ...factories) => {
  return class extends parent {
    static name = "size";

    /* Returns number of items. */
    size() {
      return this.rule.style.length;
    }
  };
};
