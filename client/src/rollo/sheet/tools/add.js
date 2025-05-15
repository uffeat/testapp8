/* 
20250303
src/rollo/sheet/tools/add.js
import { add } from "rollo/sheet/tools/add.js";
const { add } = await import("rollo/sheet/tools/add.js");
*/

import { update } from "@/rollo/sheet/tools/update.js";
import { KEYFRAMES, MEDIA } from "@/rollo/sheet/tools/constants.js";

/* Adds and returns rule. 
NOTE
- Intended for use with non-Sheet sheets. */
export function add(container, object) {
  let header = Object.keys(object)[0];
  const body = Object.values(object)[0];
  if (header.startsWith(KEYFRAMES)) {
    const name = header.slice(KEYFRAMES.length).trim();
    const rule = _add_rule(container, `${KEYFRAMES} ${name}`);
    _parse_body(rule, body);
    return rule;
  }

  if (header.startsWith(MEDIA)) {
    const condition = header.slice(MEDIA.length).trim();
    const rule = _add_rule(container, `${MEDIA} ${condition}`);
    _parse_body(rule, body);
    return rule;
  }

  if (header.endsWith("%")) {
    container.appendRule(`${header} {}`);
    const rule = container.findRule(header);
    body && update(rule, body);
    return rule;
  }

  const rule = _add_rule(container, header);
  body && update(rule, body);
  return rule;
}

function _add_rule(container, header) {
  const index = container.insertRule(`${header} {}`, container.cssRules.length);
  return container.cssRules[index];
}

function _parse_body(rule, body) {
  if (body) {
    for (const [_header, _body] of Object.entries(body)) {
      add(rule, { [_header]: _body });
    }
  }
}
