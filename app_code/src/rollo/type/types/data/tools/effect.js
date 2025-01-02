import { Change, ChangeType } from "rollo/type/types/data/tools/change";

export function Effect(...args) {
  return new EffectType(...args);
}

/* Utility for creating reactivity watcher.
NOTE
- Effect can be created
  - indirectly via 'Data.effects.add'; also registers the effect.
  - directly via 'Effect' or 'Data.Effect'; does NOT
    register the effect.
  Use the direct approach, when the effect should not be registered
  immediately.
- Tightly coupled with Data.effects. */
export class EffectType {
  constructor({ condition, disabled, name, source, tag }) {
    this.condition = condition;
    this.#disabled = disabled;
    this.#name = name;
    this.#source = source;
    this.#tag = tag;
  }

  /* Returns condition */
  get condition() {
    return this.#condition;
  }
  /* Sets condition. 
  NOTE
  - Can be changed dynamically. Powerful, but can add complexity!
  */
  set condition(condition) {
    this.#condition = condition;
  }
  #condition;

  /* Returns disabled state. */
  get disabled() {
    return this.#disabled;
  }
  /* Sets disabled state.
  NOTE
  - Turns the effect on/off (regardless of condition).
  */
  set disabled(disabled) {
    this.#disabled = disabled;
  }
  #disabled;

  /* Returns name. 
  NOTE
  - Returns name of source, if name not explicitly set.
  */
  get name() {
    if (this.#name) {
      return this.#name;
    }
    if (this.source) {
      return this.source.name;
    }
  }
  /* Sets name. */
  set name(name) {
    this.#name = name;
  }
  #name;

  /* Returns source. */
  get source() {
    return this.#source;
  }
  /* Sets source. 
  NOTE
  - Can be changed dynamically. Powerful, but can add complexity!
  */
  set source(source) {
    this.#source = source;
  }
  #source;

  /* Returns tag. */
  get tag() {
    return this.#tag;
  }
  /* Sets tag. 
  NOTE
  - General purpose property for providing additional information 
  */
  set tag(tag) {
    this.#tag = tag;
  }
  #tag;

  /* Calls source and return result. */
  call(change) {
    /* Check disabled */
    if (this.disabled) {
      return;
    }
    /* Check source */
    if (!this.source) {
      return;
    }
    if (change) {
      /* Test condition */
      if (this.condition && this.condition(change) === false) return;
      /* Call source and return result */
      return this.source(change);
    }
    /* Handle direct call (no change argument) */
    if (!this.owner) {
      throw new Error(`Cannot call unbound effect without augument.`);
    }
    change = Change({
      data: { current: this.owner.current },
      effect: this,
      owner: this.owner,
    });
    /* Test condition */
    if (this.condition && !this.condition(change) === false) return;

    try {
      return this.source(change);
    } catch (error) {
      if (!(error instanceof ChangeType.StopException)) {
        throw error;
      }
    }
  }

  /* Creates and returns clone. */
  clone() {
    return Effect({
      condition: this.#condition,
      disabled: this.#disabled,
      name: this.#name,
      source: this.#source,
      tag: this.#tag,
    });
  }

  /* Batch-updates data- and accessor props. Chainable. */
  update(update) {
    for (const [k, v] of Object.entries(update)) {
      this[k] = v;
    }
    return this;
  }

  /* Registers effect on Data instance.
  NOTE
  - Fundamentally, effects are per se independent of Data instances, and a 
    single effect can be registered on multiple Data instances. However,
    to cater for special cases (and as a syntactical alternative), 'bind'
    registers the effect on a single Data instances ('owner'). 
    While an effect can only be "bound" to a single Data instance at the time,
    "bound" effects can be registered on other Data instances.
  - "Bound" effects can "self-call", i.e., be called directly without providing
     a 'change' argument. This invokes the effect with the curent data of the 
     owner and with null for 'previous', 'session' and 'index', i.e., in the 
     same way the effect is invoked at registration. Likely only relevant for 
     (very) special cases.
  */
  bind(owner) {
    if (!owner) {
      return this.unbind();
    }
    if (this.owner && owner !== this.owner) {
      throw new Error(`Already bound.`);
    }
    if (!owner.effects) {
      throw new Error(`'owner' does not support effects.`);
    }
    this.#owner = owner;
    this.#owner.effects.add(this);

    return this;
  }

  /* Deregisters effect from Data instance. */
  unbind() {
    if (!this.owner) {
      return this;
    }
    this.owner.effects.remove(this);
    this.#owner = null;
    return this;
  }
  get owner() {
    return this.#owner;
  }
  #owner;
}
