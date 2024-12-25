import { type } from "rollo/type/type";
import { owner } from "rollo/type/factories/owner";
import { condition } from "rollo/type/types/data/factories/condition";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { source } from "rollo/type/types/conditional/factories/source";


export const Conditional = (() => {
  const composition = type.compose(
    Function,
    {}, 
    condition,
    owner,
    source,
    transformer,
  );

  class Conditional extends composition {
    static create = ({condition, source, transformer} = {}) => {
      const instance = new Conditional();

      instance.condition = condition
      instance.source = source
      instance.transformer = transformer

      return new Proxy(instance, {
        get: (target, key) => {
          return instance[key];
        },
        set: (target, key, value) => {
          instance[key] = value;
          return true;
        },
        apply: (target, thisArg, args) => {
          return instance.run.apply(instance, args);
        },
      });
    };

    constructor() {
      super();
    }

    run(...args) {
      if (!this.source) {
        throw new Error(`'source' not set.`)
      }
      if (typeof this.source !== 'function') {
        throw new Error(`'source' is not a function.`)
      }
      return this.source(...args)
    }


  }

  return type.register("conditional", Conditional);
})();
