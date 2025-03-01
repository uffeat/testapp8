// import { index } from "@/rollo/tools/sheet/tools/index";
// const { index } = await import("@/rollo/tools/sheet/tools/index");

/*  */
export const index = (container, search) => {
  const result = [...container.cssRules].findIndex(search);
  return result === -1 ? null : result;
};
