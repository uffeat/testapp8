/* 
20250303
import { object } from "rollo/sheet/tools/object.js";
const { object } = await import("rollo/sheet/tools/object.js");
*/

import { KEYFRAMES, MEDIA } from "@/rollo/sheet/tools/constants.js";
import { get as get_items } from "@/rollo/sheet/types/rule/tools/items.js";

/* Returns object representation of container's css rules.
NOTE
- Intended for use with non-Sheet sheets.
- Supported rules:
  - Top-level CSSStyleRules
  - Top-level CSSMediaRules with CSSStyleRule or CSSKeyframesRule children
  - Top-level CSSKeyframesRules with CSSKeyframeRule children
- Rule nesting is probably supported in many cases, but not thoroughly tested.
- Performs rule consolidation:
  - Same-selector style rules are consolidated (within nesting/media scope).
    If duplicate style keys, the style items get overwritten, i.e., the last 
    style item is used.
  - Same-condition media rules are consolidated.
  - Same-name keyframes rules are consolidated (within nesting/media scope).
- Can be used to inject a text-implemented native sheet into a 
  Sheet instance: instance.add(object(native_sheet))
*/
export function object(container) {
  const result = {};
  for (const rule of container.cssRules) {
    if (rule instanceof CSSStyleRule) {
      const items = get_items(rule);
      if (rule.selectorText in result) {
        Object.assign(result[rule.selectorText], items);
      } else {
        result[rule.selectorText] = items;
      }
      continue;
    }

    if (rule instanceof CSSMediaRule) {
      const key = `${MEDIA} ${rule.conditionText}`;
      if (key in result) {
        Object.assign(result[key], object(rule));
      } else {
        result[key] = object(rule);
      }
      continue;
    }

    if (rule instanceof CSSKeyframesRule) {
      const key = `${KEYFRAMES} ${rule.name}`;
      if (!(key in result)) {
        result[key] = {};
      }
      for (const r of rule.cssRules) {
        result[key][r.keyText] = get_items(r);
      }
      continue;
    }
  }
  return result;
}

/* Returns object from text.
NOTE
- The result can be injected into a Sheet instance:
  instance.add(text_to_object(text))  */
export function text_to_object(text) {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(text)
  return object(sheet)

}