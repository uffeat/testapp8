/* TODO
- Refactor to use update with '__' values.
*/

/* Implements filter method. */
export const filter = (parent, config, ...factories) => {
  return class filter extends parent {
    /* Deletes items as per provided function. Chainable. 
    NOTE
    - In contrast to its array counterpart, 'filter' mutates in-place. */
    filter(f) {
      [...Object.entries(this)].forEach(([k, v]) => {
        if (!f([k, v])) {
          delete this[k];
        }
      });
      return this;
    }
  };
};
