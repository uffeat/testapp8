/*
import hooks from "@/rollocomponent/mixins/hooks.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    /* Executes hooks bound to component and with component passed in. 
    Chainable. 
    NOTE
    - Useful, e.g., during instantiation. */
    hooks(...hooks) {
      hooks.forEach((hook) => {
        hook.call(this, this);
      });

      return this;
    }
  };
};
