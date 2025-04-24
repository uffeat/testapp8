// import { is_node } from "@/rollo/tools/is/is_node";
// const { is_node } = await import("@/rollo/tools/is/is_node");

/* Checks if a value can be used as an argument in append(value)`. */
export const is_child = (value) =>
  value instanceof Node || ["number", "string"].includes(typeof value);
