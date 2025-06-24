/* 
20250303
src/rollo/sheet/tools/find.js
import { find } from "rollo/sheet/tools/find.js";
const { find } = await import("rollo/sheet/tools/find.js");
*/

/* Returns rule in container by search function.
NOTE
- Intended for use with non-Sheet sheets. */
export const find = (container, search) => {
  return [...container.cssRules].find(search) || null;
};
