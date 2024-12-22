import { type } from "rollo/type/type";
import { Effect } from "@/rollo/type/types/state/tools/effect";
import { Message } from "@/rollo/type/types/state/tools/message";

/* Controller for effects. */
export class Effects {
  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns effects registry.
  NOTE
  - Can, but should generally not, be used outside the Effects class. */
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
  add(source, condition, transformer) {
    const effect = Effect.create({ source, condition, transformer });

    /* Register effect */
    this.#registry.set(effect, true);

    /* Call effect */
    effect.call(
      Message.create({
        current: this.owner.current,
        previous: type.create("data"),
        owner: this.owner,
      })
    );
    /* Return effect to enable later removal
    (handy, if effect was created in-line or as an object) */
    return effect;
  }

  create(source, condition, transformer) {
    return Effect.create({ source, condition, transformer });
  }

  /* Tests, if effect is in registry. */
  has(effect) {
    return this.#registry.has(effect);
  }

  /* Calls effects.
  NOTE
  - Can, but should generally not, be called outside the State class. */
  notify(message) {
    for (const [effect, _] of this.#registry) {
      effect.call(message);
    }
  }

  /* Removes effect. */
  remove(effect) {
    this.#registry.delete(effect);
  }
}
