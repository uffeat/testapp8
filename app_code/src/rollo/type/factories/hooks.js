/* Implements 'hooks' method. */
export const hooks = (parent, config, ...factories) => {
  return class hooks extends parent {
    
    /* Calls hook functions bound to this. Chainable. */
    hooks(...hooks) {
      super.hooks && super.hooks(...hooks);
      hooks
        .filter((hook) => typeof hook === "function")
        .forEach((hook) => {
          hook.call(this);
        });
      return this;
    }
  };
};