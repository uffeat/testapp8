export const is_integer = (value) => {
  return typeof value === "number" && Number.isInteger(value);
}