/* 
20250331
src/rollo/component/tools/parse.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/tools/parse.js
import { parse } from "rollo/component/tools/parse.js";
*/

import { is_callable } from "@/rollo/tools/is/is_callable.js";
import { is_child } from "@/rollo/tools/is/is_child.js";

/* Returns parsed arguments.
NOTE
- Enables flexible function signatures. */
export const parse = (arg, ...args) => {
  const [tag, ...css_classes] = arg.split(".");

  const parsed = {
    children: args.filter(is_child),
    css_classes: css_classes.length ? css_classes : null,
    hooks: args.filter((a) => is_callable(a)),
    tag,
    updates:
      args.find(
        (a) => typeof a === "object" && !is_callable(a) && !(a instanceof Node)
      ) || {},
  };

  if ("parent" in parsed.updates) {
    parsed.parent = parsed.updates.parent;
    delete parsed.updates.parent;
  }

  return parsed;
};
