/* Filters object as per provided function. Use with 'bind' or 'call' to 
bind object. Corresponds to the 'filter' array method. */
export function filter(f) {
  return Object.fromEntries(Object.entries(this).filter(f));
}

export { filter as default };
