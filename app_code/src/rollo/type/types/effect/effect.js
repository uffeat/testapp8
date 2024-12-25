import { type } from "rollo/type/type";
import { owner } from "rollo/type/factories/owner";
import { condition } from "rollo/type/types/data/factories/condition";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { source } from "rollo/type/types/effect/factories/source";

export const Effect = (() => {
  const composition = type.compose(
    Function,
    {},
    condition,
    owner,
    source,
    transformer
  );

  class Effect extends composition {
    static create = (source, condition, transformer) => {
      const instance = new Effect();

      if (condition && typeof condition !== 'function') {
        condition = interpret_condition(condition)
      }

      instance.condition = condition;
      instance.source = source;
      instance.transformer = transformer;

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
        throw new Error(`'source' not set.`);
      }
      if (typeof this.source !== "function") {
        throw new Error(`'source' is not a function.`);
      }
      if (this.condition && !this.condition(...args)) {
        return;
      }
      if (this.transformer) {
        return this.source(this.transformer(...args));
      }
      return this.source(...args);
    }
  }

  return type.register("effect", Effect);
})();


/* Creates and return condition function from short-hand. */
function interpret_condition(condition) {
  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    current must contain a key corresponding to the string short-hand. */
    return ({ current }) => condition in current;
  }

  if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    current must contain a key that is present in the array short-hand. */
    return ({ current }) => {
      for (const key of condition) {
        if (key in current) return true;
      }
      return false;
    };
  }

  if (typeof condition === "object" && Object.keys(condition).length === 1) {
    /* Create condition function from single-item object short-hand:
    current must contain a key-value pair corresponding to the object short-hand. */
    const key = Object.keys(condition)[0];
    const value = Object.values(condition)[0];
    return ({ current }) => current[key] === value;
  }

  throw new Error(`Invalid condition: ${condition}`);
}

