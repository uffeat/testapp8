/* Tests if a value is a function or an object with a call member (presumed a method). */
export const is_callable = (value) => {
  return typeof value === "function" || (value === "object" && value.call);
};
