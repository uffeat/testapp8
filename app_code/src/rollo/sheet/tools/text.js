// import { text } from "@/rollo/tools/sheet/tools/text";
// const { text } = await import("@/rollo/tools/sheet/tools/text");

import { truncate } from "@/rollo/tools/text/truncate";

/* Returns text representation of sheet content */
export function text(sheet, pretty = true) {
  const fragments = [];
  for (const rule of sheet.cssRules) {
    fragments.push(pretty ? rule.cssText : truncate(rule.cssText));
  }
  return fragments.join(pretty ? "\n" : " ");
}
