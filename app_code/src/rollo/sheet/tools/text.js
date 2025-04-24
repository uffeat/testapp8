/* 
20250303
src/rollo/sheet/tools/text.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/tools/text.js
import { text } from "rollo/sheet/tools/text.js";
const { text } = await import("rollo/sheet/tools/text.js");
*/

import { truncate } from "@/rollo/tools/text/truncate.js";

/* Returns text representation of sheet content.
NOTE
- Intended for use with non-Sheet sheets. */
export function text(sheet, pretty = true) {
  const fragments = [];
  for (const rule of sheet.cssRules) {
    fragments.push(pretty ? rule.cssText : truncate(rule.cssText));
  }
  return fragments.join(pretty ? "\n" : " ");
}
