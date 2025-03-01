// import { append } from "@/rollo/type/types/component/tools/append";
// const { append } = await import("@/rollo/type/types/component/tools/append");

export const append = (parent, child) => {
  if (parent) {
    if (typeof parent === "string") {
      const selector = parent;
      parent = document.querySelector(selector);
      if (!parent) {
        throw new Error(`Could not find parent from selector: ${selector}`);
      }
    }
    if (parent !== child.parentElement) {
      parent.append(child);
    }
  }
  return child
}