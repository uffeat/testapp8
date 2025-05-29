import _List from "@/rollostate/types/list/list.js";
import _Ref from "@/rollostate/types/ref/ref.js";
import _State from "@/rollostate/types/state/state.js";

export const List = (...args) => {};

export const Ref = (...args) => {};



/* TODO
- computed, pehaps in combo with Ref */
export const State = (...args) => {
  const options =
    args.find(
      (a, i) => !i && typeof a === "object" && typeof a !== "function"
    ) || {};
  const effects = args.filter((a) => typeof a === "function");
  const instance = new _State();
  options.current && instance.update(options.current);
  if (options.name) {
    instance.name;
  }
  if (options.owner) {
    instance.owner;
  }
  effects.forEach((effect) => instance.effects.add(effect));
  return instance;
};
