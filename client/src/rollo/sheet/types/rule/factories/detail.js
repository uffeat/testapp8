/* 
20250302 
src/rollo/sheet/types/rule/factories/detail.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rule/factories/detail.js
*/
export const detail = (parent, config, ...factories) => {
  return class extends parent {
    static name = "detail";

    /* Returns detail object.
    NOTE
    - Useful for storage of additional data. */
    get detail() {
      return this.#detail;
    }
    #detail = {};
  };
};
