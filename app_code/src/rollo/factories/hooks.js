/* Base factory for all web components. */
export const hooks = (parent) => {
  const cls = class Hooks extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Calls one or more hooks. 
    A hook is a function that is called bound to an element.
    Any hook return values are appended to the element.
    Useful during component contruction to:
    - Add effects
    - Add handlers, potentially conditionally
    - Conditionally add one or more children
    undefined hooks are ignored to support iife's. 
    Chainable. */
    call(...hooks) {
      for (const hook of hooks) {
        if (hook === undefined) {
          continue;
        }
        if (typeof hook === "function") {
          const result = hook.call(this);
          if (result === undefined) {
            continue;
          }
          if (Array.isArray(result)) {
            this.append(...result);
          } else {
            this.append(result);
          }
          continue;
        }
        if (Array.isArray(hook)) {
          this.append(...hook);
          continue;
        }
        this.append(hook);
      }
      return this;
    };
  };
  return cls;
};
