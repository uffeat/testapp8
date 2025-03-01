import { Effect } from "@/rollo/type/tools/effect";
import { Change } from "@/rollo/type/tools/change";
import { Stop } from "@/rollo/type/tools/stop";

/* Effects controller. */
export class Effects {
  constructor(owner, config = {}) {
    this.#owner = owner;
    this.#config = config;
  }
  #config;

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
    effects can be difficult to manage and should perhaps be broken up. */
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

  /* Returns number of registered effects. */
  get size() {
    return this.registry.size;
  }

  /* Creates/updates, registers and returns effect. */
  add(
    source,
    condition,
    { disabled, name, run = true, tag, transformer } = {}
  ) {
    /* Check max limit */
    if (![null, undefined].includes(this.max) && this.size >= this.max) {
      throw new Error(`Cannot register more than ${this.max} effects.`);
    }
    /* Interpret condition */
    if (this.#config.create_condition) {
      condition = this.#config.create_condition(condition);
    }
    /* Create/update effect. */
    const effect =
      source instanceof Effect
        ? source.update({ condition, disabled, name, tag, transformer })
        : new Effect({
            condition,
            disabled,
            name,
            source,
            tag,
            transformer,
          });
    /* Register effect */
    this.registry.add(effect);
    /* Call effect */
    if (run) {
      try {
        this.#run_effect(effect);
      } catch (error) {
        if (!(error instanceof Stop)) {
          throw error;
        }
      }
    }
    /* Return effect for control and later removal */
    return effect;
  }

  /* Calls registered effects.
  NOTE
  - Can, but should generally not, be used externally. */
  call(data) {
    const change = new Change({
      data,
      owner: this.owner,
      session: ++this.#session,
    });
    for (const [index, effect] of [...this.registry].entries()) {
      change.update({ index, effect });
      try {
        this.#run_effect(effect, change);
      } catch (error) {
        if (error instanceof Stop) {
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
  - Reserved for special cases. Use with caution; risk of memory leaks! */
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

  #run_effect(effect, change) {
    /* Abort, if no source or disabled */
    if (!effect.source || effect.disabled) return;
    /* Handle change argument */
    if (!change) {
      if (this.owner.__type__ === "list") {
        change = new Change({
          data: {
            added: this.owner.current,
          },
          effect,
          owner: this.owner,
        });
      } else {
        change = new Change({
          data: {
            current: this.owner.current,
          },
          effect,
          owner: this.owner,
        });
      }
    }
    /* Check condition */
    const condition = this.#config.create_condition
      ? this.#config.create_condition(effect.condition)
      : effect.condition;
    if (condition && condition.call(this.owner, change) === false) return;
    /* Apply transformer */
    if (effect.transformer) {
      /* NOTE
      - transformer can work by mutation, but also by return value */
      change = effect.transformer.call(this, change) || change;
    }
    /* Call source */
    effect.source.call(this.owner, change);
  }
}
