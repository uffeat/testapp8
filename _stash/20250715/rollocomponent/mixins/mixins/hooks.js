/*
import hooks from "@/rollocomponent/mixins/hooks.js";
20250601
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "hooks";
    /* Executes hooks bound to component and with component passed in. 
    Chainable. 
    NOTE
    - Useful in instance factories. */
    hooks(...hooks) {
      const deferred = []
      hooks.forEach((hook) => {
        const result = hook.call(this, this);
        if (typeof result === 'function') {
          deferred.push(result)
        }
      });
      setTimeout(() => {
        deferred.forEach((hook) => hook.call(this, this))
      }, 0)
      return this;
    }
  };
};
