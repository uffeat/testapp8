// import { remove } from "@/rollo/tools/sheet/tools/remove";
// const { remove } = await import("@/rollo/tools/sheet/tools/remove");

import { index } from "@/rollo/sheet/tools/index";

/*  */
export const remove = (container, search) => {
  if (container instanceof CSSKeyframesRule) {
    if (container.findRule(search)) {
      container.deleteRule(search);
    }
  } else {
    const i = index(container, search);
    if (i !== null) {
      container.deleteRule(i);
    }
  }

  return container;
};
