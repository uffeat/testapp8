/* Checks if a function is declared with the `async` keyword. */
export const is_async = (value) => {
  /* Async functions always start with 'async ' in their string representation. */
  return typeof value === "function" && value.toString().startsWith("async ");
};
