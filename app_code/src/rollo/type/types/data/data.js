import { type } from "rollo/type/type";
import { data } from "rollo/type/factories/data";
import { hooks } from "rollo/type/factories/hooks";

/* Type factory for 'data'. */
export const factory = (parent, config, ...factories) => {
  const cls = class DataType extends parent {
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
  return cls;
};

type.author(
  "data", 
  Object, 
  {}, 

  /* TODO Fix order (in author!) */
  factory,
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
