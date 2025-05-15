/* 
20250303
import { remove } from "rollo/sheet/tools/remove.js";
const { remove } = await import("rollo/sheet/tools/remove.js");
*/

import { index } from "@/rollo/sheet/tools/index.js";

/* Removes rule from container by search function. Returns container
NOTE
- Intended for use with non-Sheet sheets. */
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
