/*
import { is_primitive } from "@/rollotools/is/is_primitive.js";
const { is_primitive } = await use("@/rollotools/is/is_primitive.js");
20250616
v.1.0
*/

export const is_primitive = (value) => {
  return (
    value === undefined ||
    value === null ||
    ["bigint", "boolean", "number", "string", "symbol"].includes(typeof value)
  );
}