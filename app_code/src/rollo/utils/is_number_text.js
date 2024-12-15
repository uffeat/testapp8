/* Tests, if 'text' can be converted to number.
undefined return, if 'text' is not a string. */
export function is_number_text(text) {
  if (typeof text === "string") {
    const number = Number(text);
    if (typeof number === "number" && number === number) {
      return true;
    }
    return false
  }
}
