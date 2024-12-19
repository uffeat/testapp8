import { type } from "rollo/type/type";
import { data } from "rollo/type/factories/data";
import { hooks } from "rollo/type/factories/hooks";

class Data extends Object {
  constructor() {
    super();
  }

  /* Calls a series of functions with one function's result passed into the next 
  function. A copy of this object is passed into the first function. Returns 
  the result of the last function. */
  reduce(...funcs) {
    let value = this.clone();
    for (const func of funcs) {
      value = func(value);
    }
    return value;
  }
};

type.author(
  "data", 
  Data,
  {}, 

 
 
  data, 
  
  hooks, 

  
  
).assign(
  class {
    /* Returns shallow clone. */
    clone() {
      return type.create("data", { ...this });
    }
  }
);
