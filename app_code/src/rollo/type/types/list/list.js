import { type } from "rollo/type/type/type";
import { effects } from "rollo/type/types/list/list/factories/effects";
import { update } from "rollo/type/types/list/list/factories/update";



/*
TODO 
$.foo -> adds foo */



/* 
*/
export const List = (() => {
  const composition = type.compose(
    Object,
    {},
    effects,
    update,
  );

  class List extends composition {
    static create = (...args) => new List(...args);
    static name = "List";

    constructor(update, ...items) {
      super();
      this.update(update);
    }

    get values() {
      return [...this.#values.values()]
    }
    #values = new Set()

    add(...values) {

      const added = values.filter((v) => !this.#values.has(v) && v !== undefined)
      const removed = values.filter((v) => this.#values.has(v) && v === undefined)
      removed.forEach((item) => this.#values.delete(item))
      added.forEach((item) => this.#values.add(item))

      this.effects.call()



     
      return this
    }

    


  }

  return type.register("list", List);
})();
