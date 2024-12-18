import { type } from "rollo/type/type";
import { Effect as Handler } from "@/rollo/type/types/state/utils/_handler";
import { Effect as Argument } from "@/rollo/type/types/state/utils/_argument";

/* Controller for effects. */
export class Effects {
  constructor(owner) {

    ////console.log('owner:', owner)////

    this.#owner = owner;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns effects registry.
  NOTE
  - Can, but should generally not, be mutated outside the Effects class. */
  get registry() {
    return this.#registry;
  }
  #registry = new Map();

  /* Returns number of registered effecs. */
  get size() {
    return this.#registry.size;
  }

  /* Registers, calls and returns effect.
  NOTE 
  - Effects are stored as keys with condition as values. */
  add(handler) {
    if (!(handler instanceof Handler)) {
      /* Create handler */
      const { condition, source, transformer } = handler
      handler = Handler.create({ condition, source, transformer });
    } 
    /* Register handler */
    this.#registry.set(handler, true);
    /* Call handler */


    /*
    console.log('handler:', handler)////
    console.log('argument:', Argument.create({
      current: this.owner.current,
      previous: type.create("data"),
      owner: this.owner,
    }))////
    */




    handler.call(
      Argument.create({
        current: this.owner.current,
        previous: type.create("data"),
        owner: this.owner,
      })
    );
    /* Return handler to enable later removal
    (handy, if handler was created in-line or as an object) */
    return handler;
  }

  create({ condition, source, transformer }) {
    return Handler.create({ condition, source, transformer });
  }

  /* Tests, if effect is in registry. */
  has(handler) {
    return this.#registry.has(handler);
  }

  /* Calls handlers.
  NOTE
  - Can, but should generally not, be called outside the State class. */
  notify(effect) {
    for (const [handler, _] of this.#registry) {
      handler.call(effect);
    }
  }

  /* Removes effect. */
  remove(handler) {
    this.#registry.delete(handler);
  }
}
