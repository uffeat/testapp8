// import { find } from "@/rollo/tools/sheet/tools/find";
// const { find } = await import("@/rollo/tools/sheet/tools/find");

export const find = (container, search) => {
  return [...container.cssRules].find(search) || null;
};
