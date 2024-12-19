import { type } from "rollo/type/type";
import { data } from "rollo/type/types/data/factories/data";
import { hooks } from "rollo/type/factories/hooks";

/* Implementation class for the 'data' factory. */
class DataType extends Object {
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
}

type
  .author(
    "data",
    DataType,
    {},
    hooks,
    data
  )
  .assign(
    class {
      /* Returns shallow clone. */
      clone() {
        return type.create("data", { ...this });
      }
    }
  );
