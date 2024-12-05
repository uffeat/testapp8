/* Factory for all web components. */
export const hooks = (parent, config, ...factories) => {
  const cls = class Hooks extends parent {
    constructor(...args) {
      super(...args);
    }

    call(...hooks) {
      if (super.call) {
        hooks = super.call(hooks);
      }
      const deffered = [];
      const unhandled = []
      for (let hook of hooks) {
        if (typeof hook === "function") {
          hook = hook.call(this);
          if (typeof hook === "function") {
            deffered.push(hook);
            continue;
          }
        }
        if (hook === undefined) {
          continue;
        }
        unhandled.push(hook)
      }
      setTimeout(() => {
        for (const hook of deffered) {
          hook.call(this);
        }
      }, 0);
      return unhandled;
    }
  };
  return cls;
};
