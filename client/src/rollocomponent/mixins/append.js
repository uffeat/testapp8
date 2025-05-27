export default (parent, config) => {
  return class extends parent {
    append(...children) {
      super.append(...children)
      return this;
    }

    
  };
};
