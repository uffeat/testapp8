/*
import { is_node } from "@/rollo/tools/is/is_node.js";
*/


/* Checks if a value can be used as an argument in append(value)`. */
export const is_child = (value) =>
  value instanceof Node || ["number", "string"].includes(typeof value);
