/* Factory that invokes hook functions in 'call'. */
export const hooks = (parent, config, ...factories) => {
  const cls = class Hooks extends parent {
    /* Handles hooks. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - after 'update' 
    - before 'created_callback'
    - before live DOM connection */
    call(...hooks) {
      super.call && super.call(...hooks);
      /* Handle functions */
      const deffered = [];
      hooks
        .filter((arg) => typeof arg === "function")
        .forEach((hook) => {
          const result = hook.call(this);
          if (typeof result === "function") {
            deffered.push(result);
          }
        });
      setTimeout(() => {
        deffered.forEach((hook) => hook.call(this));
      }, 0);
      return this
    }
  };
  return cls;
};
