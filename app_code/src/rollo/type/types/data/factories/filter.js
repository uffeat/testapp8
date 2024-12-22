/* . */
export const filter = (parent, config, ...factories) => {
  return class filter extends parent {
    
    /* Deletes items as per provided function. */
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
