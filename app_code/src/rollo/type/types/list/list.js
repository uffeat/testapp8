import { type } from "rollo/type/type/type";
import { condition } from "rollo/type/types/data/factories/condition";
import { effects } from "rollo/type/types/data/factories/effects";
import { transformer } from "rollo/type/types/data/factories/transformer";
import { name } from "rollo/type/types/value/factories/name";
import { owner } from "rollo/type/types/value/factories/owner";

/*
TODO 
$.foo -> adds foo */

const cls = (() => {
  const composition = type.compose(
    Object,
    {},
    condition,
    effects,
    name,
    owner,
    transformer
  );

  class List extends composition {
    static name = "List";

    constructor(...values) {
      super();
      this.add(...values)
    }

    get current() {
      return [...this.#current];
    }
    #current = new Set();

    get previous() {
      return [...this.#previous];
    }
    #previous = [];

    /* TODO
    - 'difference', 'match', 'update', 'size'
     */

    add(...values) {
      /* Infer changes */
      const added = values.filter((v) => !this.#current.has(v));
      if (!added.length) {
        return this;
      }
      /* Update previous */
      this.#previous = this.#current;
      /* Update current */
      for (const v of added) {
        this.#current.add(v);
      }
      /* Call effects */
      if (this.effects.size) {
        this.effects.call({ added });
      }
      return this;
    }

    remove(...values) {
      /* Infer changes */
      const removed = values.filter((v) => this.#current.has(v));
      if (!removed.length) {
        return this;
      }
      /* Update previous */
      this.#previous = this.#current;
      /* Update current */
      for (const v of removed) {
        this.#current.delete(v);
      }
      /* Call effects */
      if (this.effects.size) {
        this.effects.call({ removed });
      }
      return this;
    }
  }

  return type.register(List);
})();

/* .*/
export function List(...values) {
  return type.create("list", ...values);
}

export const ListType = cls;
