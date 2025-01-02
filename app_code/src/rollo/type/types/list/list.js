import { type } from "rollo/type/type/type";

import { computed } from "rollo/type/types/data/factories/computed";
import { condition } from "rollo/type/types/data/factories/condition";
import { effects } from "rollo/type/types/data/factories/effects";
import { reduce } from "rollo/type/types/data/factories/reduce";
import { transformer } from "rollo/type/types/data/factories/transformer";

import { name } from "rollo/type/types/value/factories/name";
import { owner } from "rollo/type/types/value/factories/owner";

import { $ } from "rollo/type/types/list/factories/$";
import { clear } from "rollo/type/types/list/factories/clear";
import { clone } from "rollo/type/types/list/factories/clone";
import { filter } from "rollo/type/types/list/factories/filter";
import { for_each } from "rollo/type/types/list/factories/for_each";
import { map } from "rollo/type/types/list/factories/map";
import { text } from "rollo/type/types/list/factories/text";

const cls = (() => {
  const composition = type.compose(
    Object,
    {},
    $,
    clear,
    clone,
    computed,
    condition,
    effects,
    filter,
    for_each,
    map,
    name,
    owner,
    reduce,
    text,
    transformer
  );

  class List extends composition {
    static name = "List";

    constructor(...values) {
      super();
      this.add(...values);
    }













    /* Returns array representation of values. */
    get current() {
      return [...this.#current];
    }
    #current = new Set();

    /* Returns array representation of values as-were before most recent 
    change. */
    get previous() {
      return [...this.#previous];
    }
    #previous = [];

    /* Returns number of values. */
    get size() {
      return this.#current.size;
    }

    /* Returns SetIterator. */
    get values() {
      return this.#current.values();
    }

    /* */
    add(...values) {
      /* Filter as per condition */
      if (this.condition && this.condition(...values) === false) {
        return;
      }
      /* Transform as per transformer */
      if (this.transformer) {
        const result = this.transformer(...values);
        if (result !== undefined) {
          values = result;
        }
      }
      /* Infer changes */
      const added = new Set(values).difference(this.#current);
      /* Abort, if no change */
      if (!added.size) return this;
      /* Update previous */
      this.#previous = this.#current;
      /* Update current */
      this.#current = this.#current.union(added);
      /* Call effects */
      if (this.effects.size) {
        this.effects.call({ added: [...added] });
      }
      return this;
    }

    /* */
    difference(other, reverse = false) {
      if (reverse) {
        return [...new Set(other).difference(this.#current)];
      }
      return [...this.#current.difference(new Set(other))];
    }

    /* */
    freeze() {
      Object.freeze(this.#current);
      return this;
    }

    /* */
    has(value) {
      return this.#current.has(value);
    }

    /* */
    includes(other, reverse = false) {
      if (reverse) {
        return this.#current.isSubsetOf(new Set(other));
      }
      return new Set(other).isSubsetOf(this.#current);
    }

    /* */
    intersection(other) {
      return [...this.#current.intersection(new Set(other))];
    }

    /* */
    match(other) {
      return this.#current.symmetricDifference(new Set(other)).size === 0;
    }

    remove(...values) {
      /* Infer changes */
      const removed = this.#current.intersection(new Set(values));
      /* Abort, if no change */
      if (!removed.size) return this;
      /* Update previous */
      this.#previous = this.#current;
      /* Update current */
      this.#current = this.#current.difference(removed);
      /* Call effects */
      if (this.effects.size) {
        this.effects.call({ removed: [...removed] });
      }
      return this;
    }

    /* */
    symmetric_difference(other) {
      return [...this.#current.symmetricDifference(new Set(other))];
    }

    /* */
    union(other) {
      return [...this.#current.union(new Set(other))];
    }
  }

  return type.register(List);
})();

/* Reactive unique key store with array- and set-like methods,  
and methods for in-place mutation. 
NOTE
- Zero dependencies.
- Pure JS; does not use browser APIs.
- Relies on Vite, only for import syntax.
*/
export function List(...values) {
  return type.create("list", ...values);
}

export const ListType = cls;
