/*
import { is_sheet_target } from "@/rollotools/is/is_sheet_target.js";
const { is_sheet_target } = await use("@/rollotools/is/is_sheet_target.js");
20250618
v.1.0
*/

/* Tests, if target can (likely) adopt sheets. */
export const is_sheet_target = (target) => {
  return (
    target === document ||
    target instanceof ShadowRoot ||
    target.adoptedStyleSheets
  );
}