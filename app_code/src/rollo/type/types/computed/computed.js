import { type } from "rollo/type/type/type";
import { Data } from "rollo/type/types/data/data";


/* .
*/
export const Computed = (() => {
  const composition = type.compose(
    Data,
    {},
   
  );

  class Computed extends composition {
    static create = (...args) => new Computed(...args);
    static name = "Computed";
   

    constructor() {
      super();
      
    }
  }

 

  return type.register("computed", Computed);
})();
