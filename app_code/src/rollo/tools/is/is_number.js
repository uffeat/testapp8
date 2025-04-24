export const is_number = (value) => {
  return typeof value === "number" && !Number.isNaN(value);
}