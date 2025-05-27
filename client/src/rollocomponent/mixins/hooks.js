export default (parent, config) => {
  return class extends parent {
    hooks(...hooks) {
      hooks.forEach((hook) => {
        hook.call(this, this)
      })
     
      return this;
    }

    
  };
};
