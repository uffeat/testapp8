// import { is_primitive } from "@/rollo/tools/is/is_primitive";
// const { is_primitive } = await import("@/rollo/tools/is/is_primitive");

export const is_primitive = (value) => {
  return (
    value === undefined ||
    value === null ||
    ["bigint", "boolean", "number", "string", "symbol"].includes(typeof value)
  );
}