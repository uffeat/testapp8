// import { is_node } from "@/rollo/tools/is/is_node";
// const { is_node } = await import("@/rollo/tools/is/is_node");

export const is_node = (v) =>
  v instanceof HTMLElement || ["number", "string"].includes(typeof v);
