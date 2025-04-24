/* 
20250303
src/rollo/sheet/tools/index.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/tools/index.js
import { index } from "rollo/sheet/tools/index.js";
const { index } = await import("rollo/sheet/tools/index.js");
*/

/* Returns index of rule in container by search function.
NOTE
- Intended for use with non-Sheet sheets. */
export const index = (container, search) => {
  const result = [...container.cssRules].findIndex(search);
  return result === -1 ? null : result;
};
