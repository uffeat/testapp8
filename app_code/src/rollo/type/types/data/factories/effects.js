import { Effect, EffectType } from "rollo/type/types/data/tools/effect";
import { Change, ChangeType } from "rollo/type/types/data/tools/change";

/* Implements 'effects' getter. */
export const effects = (parent, config, ...factories) => {
  return class extends parent {
    static name = "effects";
    /* Returns effects controller. */
    get effects() {
      return this.#effects;
    }
    #effects = new Effects(this);
  };
};

/* Effects controller. */
class Effects {
  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns max number of effects allowed. */
  get max() {
    return this.#max;
  }
  /* Sets max number of effects allowed.
  NOTE
  - null/undefined removes limit.
  - Primarily used to catch memory leaks, e.g., when effects are to be added and 
    removed frequently, but fails to be removed. The default max of 10 is a judgement 
    call - based on the assumption that a data object with more than 10 concurrent
    effects can be difficult to manage and should perhaps be broken up into smaller
    "state islands".
  */
  set max(max) {
    this.#max = max;
  }
  #max = 10;

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns effects registry.
  NOTE
  - Can, but should generally not, be used externally. 
  */
  get registry() {
    return this.#registry;
  }
  #registry = new Set();

  /* Returns number of effects registered. */
  get size() {
    return this.registry.size;
  }

  /* Creates, registers and returns effect. */
  add(source, condition, tag) {
    /* Check max limit */
    if (![null, undefined].includes(this.max) && this.size >= this.max) {
      throw new Error(`Cannot register more than ${this.max} effects.`);
    }
    if (this.owner.create_condition) {
      condition = this.owner.create_condition(condition);
    }
    let effect;
    if (source instanceof EffectType) {
      /* Update effect */
      effect = source.update({ condition, tag });
    } else {
      /* Create effect */
      effect = Effect({
        condition,
        source,
        tag,
      });
    }
    /* Register effect */
    this.registry.add(effect);
    /* Call effect */
    try {
      effect.call(
        Change({
          data: {current: this.owner.current},
          effect,
          owner: this.owner,
        })
      );
    } catch (error) {
      if (!(error instanceof ChangeType.StopException)) {
        throw error;
      }
    }
    /* Return effect for control and later removal */
    return effect;
  }

  /* Calls registered effects.
  NOTE
  - Can, but should generally not, be used externally. 
  - 'effect.call' should generally not return anything explicitly. However,
    for special cases, if 'effect.call' returns false, subsequent effects in
    the session are not called; similar to `event.stopPropagation()`.
  */
  call(data) {
    const change = Change({
      data,
      owner: this.owner,
      session: ++this.#session,
    });
    for (const [index, effect] of [...this.registry].entries()) {
      change.index = index;
      change.effect = effect;
      try {
        const result = effect.call(change);
        if (result === false) {
          break;
        }
      } catch (error) {
        if (error instanceof ChangeType.StopException) {
          break;
        } else {
          throw error;
        }
      }
    }
  }
  #session = 0;

  /* Removes all effects.
  NOTE
  - Reserved for special cases. Use with caution; risk of memory leaks!
  */
  clear() {
    this.registry.clear();
  }

  /* Tests, if effect is registered. */
  has(effect) {
    return this.registry.has(effect);
  }

  /* Deregisters effect. */
  remove(effect) {
    this.registry.delete(effect);
  }
}
