import { Change } from "@/rollo/type/tools/change";
import { Stop } from "@/rollo/type/tools/stop";

/* Utility for creating reactivity watcher.
NOTE
- Effect can be created
  - indirectly via 'effects.add'; also registers the effect.
  - directly via 'Effect' ; does NOT register the effect.
  Use the direct approach, when the effect should not be registered
  immediately. */
export class Effect {
  constructor({ condition, disabled, name, source, tag, transformer }) {
    this.update({ condition, disabled, name, source, tag, transformer });
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
  #condition;

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
  #disabled;

  /* Returns name. 
  NOTE
  - Returns name of source, if name not explicitly set. */
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
  - Can be changed dynamically. Powerful, but can add complexity! */
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
  - General purpose property for providing additional information */
  set tag(tag) {
    this.#tag = tag;
  }
  #tag;

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
  #transformer;

  /* Creates and returns clone with selected props. 
  NOTE
  - Since 'tag' may be a mutable, it's not included, but can be set from arg. */
  clone(tag) {
    return new Effect({
      condition: this.condition,
      disabled: this.disabled,
      source: this.source,
      tag,
      transformer: this.transformer
    });
  }

  /* Batch-updates accessor props. Chainable.
  NOTE
  - undefined values are ignored. 
  - Allows setting of data props with '_'-prefix. */
  update(update) {
    for (const [k, v] of Object.entries(update)) {
      if (!(k in this) && !k.startsWith('_')) {
        throw new Error(`Invalid key: ${k}`)
      }
      if (v !== undefined) {
        this[k] = v;
      }
    }
    return this;
  }
}
