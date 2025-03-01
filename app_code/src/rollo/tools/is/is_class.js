// import { is_class } from "@/rollo/tools/is/is_class";
// const { is_class } = await import("@/rollo/tools/is/is_class");

/* Tests, if value is a class. */
export function is_class(value) {
  return (
    typeof value === "function" &&
    /^class\s/.test(Function.prototype.toString.call(value))
  );
}