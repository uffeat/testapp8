// import { can_have_shadow } from "@/rollo/tools/can_have_shadow";
// const { can_have_shadow } = await import("@/rollo/tools/can_have_shadow");

export const can_have_shadow = (element) => {
  try {
    element.attachShadow({ mode: "open" });
    return true
  } catch {
    return false
  }
}