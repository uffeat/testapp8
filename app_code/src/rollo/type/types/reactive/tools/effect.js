// import { Effect } from "@/rollo/type/types/reactive/tools/effect";
// const { Effect } = await import("@/rollo/type/types/reactive/tools/effect");

/* */
export const Effect = (
  source,
  condition,
  { config, detail, disabled, name, owner, transformer } = {}
) => {
  return new EffectType({
    condition,
    config,
    detail,
    disabled,
    name,
    owner,
    source,
    transformer,
  });
};

export class EffectType {
  static name = "EffectType";

  #condition;
  #config = { run: false };
  #detail = {};
  #disabled;
  #name;
  #owner;
  #source;
  #transformer;

  constructor({
    condition,
    config,
    detail,
    disabled,
    name,
    owner,
    source,
    transformer,
  } = {}) {
    if (config) {
      this.#config = config;
    }

    this.update({ condition, disabled, name, source, transformer });

    if (detail) {
      this.#detail = detail;
    }

    if (owner) {
      this.owner = owner;
    }
  }

  /* Returns condition */
  get condition() {
    return this.#condition;
  }
  /* Sets condition. 
  NOTE
  - Can be changed dynamically. Powerful, but can add complexity! */
  set condition(condition) {
    this.#condition = condition;
  }

  /* Returns config. */
  get config() {
    return this.#config;
  }

  /* Returns detail. 
  NOTE
  - Useful, e.g., for
    - access to external data
    - inter source/condition/transformer communication
    - storing ad-hoc data
    - testing. */
  get detail() {
    return this.#detail;
  }

  /* Returns disabled state. */
  get disabled() {
    return this.#disabled;
  }
  /* Sets disabled state.
  NOTE
  - Turns the effect on/off (regardless of condition). */
  set disabled(disabled) {
    this.#disabled = disabled;
  }

  /* Returns name. */
  get name() {
    return this.#name;
  }
  /* Sets name. */
  set name(name) {
    this.#name = name;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  /* Sets owner. */
  set owner(owner) {
    if (this.#owner && this.#owner.effects) {
      this.#owner.effects.remove(this);
    }
    if (owner && owner.effects) {
      owner.effects.add(this);
    }
    this.#owner = owner;
  }

  /* Returns source. */
  get source() {
    return this.#source;
  }
  /* Sets source. 
  NOTE
  - Can be changed dynamically. Powerful, but can add complexity! */
  set source(source) {
    this.#source = source;
  }

  /* Returns transformer. */
  get transformer() {
    return this.#transformer;
  }
  /* Sets transformer. 
  NOTE
  - Can be changed dynamically. Powerful, but can add complexity! */
  set transformer(transformer) {
    this.#transformer = transformer;
  }

  /* Calls source (optionally with transformed change) and returns result; 
  subject to disabled and condition. */
  call(context, change) {
    if (change === undefined) {
      if (this.owner && this.owner.run) {
        return this.owner.run(this);
      } else {
        throw new Error(
          `Effects cannot be called, when owner not set appropriately.`
        );
      }
    }

    if (
      this.disabled ||
      !this.source ||
      (this.condition && !this.condition.call(this, change, this))
    ) {
      return;
    }

    if (this.transformer) {
      const result = this.transformer.call(this, change, this);
      if (result !== undefined) {
        change = result;
      }
    }
    return this.source.call(this, change, this);
  }

  /* Batch-updates accessor props. Chainable.
  NOTE
  - undefined values are ignored. 
  - Allows setting of data props with '_'-prefix. */
  update(updates) {
    for (const [k, v] of Object.entries(updates)) {
      if (!(k in this) && !k.startsWith("_")) {
        throw new Error(`Invalid key: ${k}`);
      }
      if (v !== undefined) {
        this[k] = v;
      }
    }
    return this;
  }
}
