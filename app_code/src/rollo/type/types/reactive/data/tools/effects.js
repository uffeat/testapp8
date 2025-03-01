import { Change } from "@/rollo/type/types/reactive/tools/change";
import { EffectsType } from "@/rollo/type/types/reactive/tools/effects";

/* Returns effects controller. */
export const Effects = (...args) => {
  return new DataEffectsType(...args);
};

export class DataEffectsType extends EffectsType {
  constructor(owner) {
    super(owner);
  }

  /* Calls effect and returns its result. */
  run(effect, type = "") {
    let data = {};
    const added = Object.freeze(
      Object.fromEntries(
        Object.entries(this.owner.current).filter(
          ([k, v]) => !(k in this.owner.previous)
        )
      )
    );
    const removed = Object.freeze(
      Object.keys(this.owner.previous).filter((k) => !(k in this.owner.current))
    );

    if (type === "") {
      data = {
        added,
        current: this.owner.current,
        previous: this.owner.previous,
        removed,
      };
    } else if (type === "add") {
      data = {
        added,
      };
    } else if (type === "remove") {
      data = {
        removed,
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
