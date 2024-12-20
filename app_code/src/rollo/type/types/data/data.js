import { type } from "rollo/type/type";
import { data } from "rollo/type/types/data/factories/data";
import { hooks } from "rollo/type/factories/hooks";

const Composite = type.compose(Object, {}, data, hooks);

/* Implementation class for the 'data' factory. */
class Data extends Composite {
  static create = (update) => {
    return new Data().update(update);
  };

  constructor() {
    super();
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

type.register("data", Data);
