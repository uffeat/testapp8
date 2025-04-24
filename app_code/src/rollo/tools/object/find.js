/* Returns the first entry found in target that satifies provided test function. */
export const find = (target, test) => {
  for (const [key, value] of Object.entries(target)) {
    if (test([key, value])) {
      return [key, value]
    }
  }
  return null
}
