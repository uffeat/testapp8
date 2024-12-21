/* Factory that calls hook functions bound in 'call'. */
export const hooks = (parent, config, ...factories) => {
  return class hooks extends parent {
    constructor() {
      super();
    }
    /* . */
    hooks(...hooks) {
      super.hooks && super.hooks(...hooks);
      /* Call hooks bound */
      hooks
        .filter((hook) => typeof hook === "function")
        .forEach((hook) => {
          hook.call(this);
        });
      return this;
    }
  };
};