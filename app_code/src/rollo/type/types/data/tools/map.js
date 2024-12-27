/* Transforms items as per provided function. Use with 'bind' or 'call' to
bind object. Corresponds to the 'map' array method. */
export function map(f) {
  return Object.fromEntries(Object.entries(this).map(f));
}


