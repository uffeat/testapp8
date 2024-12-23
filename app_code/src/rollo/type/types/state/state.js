import { type } from "rollo/type/type";
import { name } from "rollo/type/factories/name";
import { owner } from "rollo/type/factories/owner";
import { condition } from "rollo/type/types/state/factories/condition";
import { transformer } from "rollo/type/types/state/factories/transformer";
import { update } from "rollo/type/types/state/factories/update";

type.register(
  "state",
  class State extends type.compose(
    Object,
    {},
    condition,
    transformer,
    name,
    owner,
    update
  ) {
    static create = (update) => {
      const instance = new State().update(update);

      return new Proxy(this, {
        get: (target, key) => {
          return instance[key];
        },
        set: (target, key, value) => {
          if (instance.__chain__.defined.has(key)) {
            instance[key] = value;
            return true;
          }
          /* Ensure that setting non-defined items goes through update */
          instance.update({ [key]: value });
          return true;
        },
        has: (target, key) => {
          return key in instance.current;
        },

        apply: (target, thisArg, args) => {
          return instance.update.apply(instance, args);
        },
      });
    };
    
    constructor() {
      super();
    }

    /* Returns clone with shallow copy of current data and everything else reset. */
    clone() {
      return type.create("state", { ...this.current });
    }
  }
);
