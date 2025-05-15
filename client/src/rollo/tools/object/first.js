/* Returns first entry of item.
NOTE
-  Intended for objects with a single entry. */
export const first = (object) => {
  const entries = Object.entries(object)
  if (entries.length !== 1) {
    console.error('object:', object)
    throw new Error(`'object' should have a single entry.`)
  }
  return entries[0];
}