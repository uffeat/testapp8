// import { update } from "@/rollo/tools/sheet/tools/update";
// const { update } = await import("@/rollo/tools/sheet/tools/update");

import { camel_to_kebab } from "@/rollo/tools/text/case";
import { validate } from "@/rollo/sheet/types/rule/tools/validate";


/* Updates rule.
NOTE
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