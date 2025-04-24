/* 
20250309
src/rollo/sheet/tools/target.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/tools/target.js
import { adopt, has, is_target, unadopt } from "rollo/sheet/tools/target.js";
const { adopt, has, is_target, unadopt } = await import("rollo/sheet/tools/target.js");
*/
import { remove } from "@/rollo/tools/array/remove.js";


/* Adopts sheets to target. Returns target. 
NOTE
- Does (intentionally) NOT check, if sheet already adopted, i.e., risk of 
  over-adoption. Such responsibility should be assumed by, e.g., 'has'
  or the TargetsType controller. */
export function adopt(target, ...sheets) {
  target.adoptedStyleSheets.push(...sheets);
  return target;
}

/* Tests, if target has adopted sheet. */
export function has(target, sheet) {
  const adopted = target.adoptedStyleSheets;
  for (const _sheet of adopted) {
    if (_sheet === sheet) {
      return true;
    }
  }
  return false;
}



/* Unadopts sheets from target. Returns target. */
export function unadopt(target, ...sheets) {
  remove(target.adoptedStyleSheets, ...sheets)
  return target;
}
