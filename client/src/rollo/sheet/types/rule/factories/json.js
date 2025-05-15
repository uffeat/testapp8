/* 
20250302 
src/rollo/sheet/types/rule/factories/json.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rule/factories/json.js
*/
export const json = (parent, config, ...factories) => {
  return class extends parent {
    static name = "json";

    /* Returns json representation of rule. */
    json() {
      return JSON.stringify(this.object());
    }
  };
};
