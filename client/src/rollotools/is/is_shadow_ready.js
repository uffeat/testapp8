/*
import { is_shadow_ready } from "@/rollotools/is/is_shadow_ready.js";
const { is_shadow_ready } = await use("@/rollotools/is/is_shadow_ready.js");
20250616
v.1.0
*/

export const is_shadow_ready = (element) => {
  try {
    element.attachShadow({ mode: "open" });
    return true
  } catch {
    return false
  }
}