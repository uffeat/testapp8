/* Tests, if value is a class. */
export function is_class(value) {
  return (
    typeof value === "function" &&
    /^class\s/.test(Function.prototype.toString.call(value))
  );
}