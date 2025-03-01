import { Change } from "@/rollo/type/types/reactive/tools/change";
import { EffectsType } from "@/rollo/type/types/reactive/tools/effects";

/* Returns effects controller. */
export const Effects = (...args) => {
  return new ListEffectsType(...args);
};

export class ListEffectsType extends EffectsType {
  constructor(owner) {
    super(owner);
  }

  /* Calls effect and returns its result. */
  run(effect, type = "") {
    const dict = this.owner.__dict__;

    let data = {};

    if (type === "") {
      data = {
        added: this.owner.current,
        removed: Object.freeze([
          ...new Set(this.owner.previous).difference(dict.current), //
        ]),
      };
    } else if (type === "add") {
      data = {
        added: this.owner.current,
      };
    } else if (type === "remove") {
      data = {
        removed: Object.freeze([
          ...new Set(this.owner.previous).difference(dict.current), //
        ]),
      };
    }

    const change = Change({
      data: Object.freeze(data),
      effect,
      owner: this.owner,
      type,
    });
    
    return effect.call(this.owner, change);
  }
}
