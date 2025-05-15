/* Checks if a function is an arrow function. */
export const is_arrow = (value) => {
  /* Arrow functions lack a prototype and have an arrow (`=>`) in their string representation. */
  return (
    typeof value === "function" &&
    !value.hasOwnProperty("prototype") &&
    value.toString().includes("=>")
  );
};
