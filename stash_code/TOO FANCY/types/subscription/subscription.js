import { type } from "rollo/type/type";
import { owner } from "rollo/type/factories/owner";
import { condition } from "rollo/type/types/data/factories/condition";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { source } from "rollo/type/types/effect/factories/source";
import { Data } from "rollo/type/types/data/data";

export const Subscription = (() => {
  const composition = type.compose(
    Object,
    {},
    condition,
    //owner,
    source,
    transformer
  );

  class Subscription extends Object {
    static create = (condition, publisher, reducer, transformer) => {
      const instance = new Subscription();

      instance.condition = condition;
      instance.reducer = reducer;
      instance.publisher = publisher;
      instance.transformer = transformer;

      return instance;
    };

    constructor() {
      super();
    }
  }

  return type.register("subscription", Subscription);
})();
