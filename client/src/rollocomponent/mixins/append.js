export default (parent, config) => {
  return class extends parent {

    /* Appends children. Chainable. */
    append(...children) {
      super.append(...children)
      return this;
    }

    
  };
};
