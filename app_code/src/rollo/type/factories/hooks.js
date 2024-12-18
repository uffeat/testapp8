/* Factory that calls hook functions bound in 'call'. */
export const hooks = (parent, config, ...factories) => {
  const cls = class Hooks extends parent {
    /* Handles hook functions. Chainable. 
    Called during creation:
    - after 'constructed_callback'
    - after 'update' 
    - before 'created_callback'
    */
    call(...hooks) {
      super.call && super.call(...hooks);
      /* Call functions bound */
      hooks
        .filter((hook) => typeof hook === "function")
        .forEach((hook) => {
          hook.call(this);
        });

      return this;
    }
  };
  return cls;
};
