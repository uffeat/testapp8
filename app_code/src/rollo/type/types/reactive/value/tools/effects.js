import { Change } from "@/rollo/type/types/reactive/tools/change";
import { EffectsType } from "@/rollo/type/types/reactive/tools/effects";

/* Returns effects controller. */
export const Effects = (...args) => {
  return new ValueEffectsType(...args);
};

export class ValueEffectsType extends EffectsType {
  constructor(owner) {
    super(owner);
  }

  /* Calls effect and returns its result. */
  run(effect, type = "") {
    let data = {};

    if (type === "") {
      data = {
        current: this.owner.current,
        previous: this.owner.previous,
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
