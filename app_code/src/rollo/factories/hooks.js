/* Factory for all web components. */
export const hooks = (parent, config, ...factories) => {
  const cls = class Hooks extends parent {
    constructor(...args) {
      super(...args);
    }

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);
      this.call(...args)
    }

    call(...args) {
      super.call && super.call(...args);

      const deffered = [];
      args
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
    }
  };
  return cls;
};
