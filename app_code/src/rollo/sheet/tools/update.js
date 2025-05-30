/* 
20250303
src/rollo/sheet/tools/update.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/tools/update.js
import { update } from "rollo/sheet/tools/update.js";
const { update } = await import("rollo/sheet/tools/update.js");
*/

import { camel_to_kebab } from "@/rollo/tools/text/case.js";
import { validate } from "@/rollo/sheet/types/rule/tools/validate.js";


/* Updates rule.
NOTE
- Intended for use with non-Sheet sheets.
- undefined item value removes item.
- Invalid item keys are ignored, but triggers warning. */
export function update(rule, items = {}) {
  if (Array.isArray(items)) {
    items = Object.fromEntries(items);
  }
  const style = rule.style;
  for (const [_key, _value] of Object.entries(items)) {
    /* Case-convert key */
    const key = _key.startsWith("--") ? _key : camel_to_kebab(_key.trim());
    /* Ignore invalid keys */
    if (!validate(key)) {
      console.warn("Ignored invalid key:", key); ////
      continue;
    }
    /* undefined -> cue to remove */
    if (_value === undefined) {
      style.removeProperty(key);
    } else {
      /* Ensure that value is a string */
      const value = _value === null ? "none" : String(_value);
      /* Update rule */
      if (value.endsWith("!important")) {
        style.setProperty(
          key,
          value.slice(0, -"!important".length),
          "important"
        );
      } else {
        style.setProperty(key, value);
      }
    }
  }
  return rule;
}