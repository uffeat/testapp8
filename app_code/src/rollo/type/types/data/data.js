import { type } from "rollo/type/type";
import { data } from "rollo/type/types/data/factories/data";
import { hooks } from "rollo/type/factories/hooks";

/* Implementation class for the 'data' factory. */
class DataType extends Object {


  constructor() {
    super();
  }

  create(update) {
    this.update(update)
  }

  

  /* Returns shallow clone. Enables use of Data methods without mutation. */
  clone() {
    return this.__class__.create({ ...this });

    const cloned = new this.__class__();
    cloned.update({ ...this });
    return cloned;

    return type.create("data", { ...this });
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

type.author("data", DataType, {}, hooks, data);
