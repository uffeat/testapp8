import { condition } from "rollo/type/types/data/factories/condition";
import { transformer } from "rollo/type/types/data/factories/transformer";

/* Factory for enhancing plain object features, notably:
- Batch updating.
- Conditional mutation with (chainable) methods that resemble 
  (mutating versions of) array methods.
*/
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    static dependencies = [condition, transformer];
    /* Sets all items to a provided value. Chainable. */
    reset(value) {
      this.update(
        Object.fromEntries(Object.entries(this).map(([k, v]) => [k, value]))
      );
      return this;
    }

    /* Mutates items as per provided function. Chainable. */
    transform(f) {
      this.update(Object.fromEntries(Object.entries(this).map(f)));
      return this;
    }

    /* Mutates items from provided object. Returns change data. */
    update(update) {
      if (!update) return this;
      /* Allow update as entries array */
      if (Array.isArray(update)) {
        update = Object.fromEntries(update);
      }

      const current = {};
      const previous = {};

      if (!this.condition || this.condition(update)) {
        if (this.transformer) {
          update = this.transformer(update);
        }

        for (const [k, v] of Object.entries(update)) {
          if (this[k] !== v) {
            previous[k] = this[k];
            current[k] = v;
          }
          this[k] = v;
        }
      }

      return [current, previous];
    }
  };
};
