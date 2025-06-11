/*
import { factory } from "@/rollocomponent/tools/factory.js";
20250605
v.1.1
*/

import { Args } from "@/rollocomponent/tools/args.js";

/* Returns instance factory function.
NOTE
- cls can be a component class (or other constructor function) or a component 
instance. */
export const factory = (cls) => {
  return (...args) => {
    const instance = typeof cls === "function" ? new cls() : cls;
    /* Parse args */
    args = new Args(args);
    /* Call '__new__' to invoke pre-config actions */
    instance.constructor.__new__?.call(instance);
    instance.__new__?.();
    /* Add CSS classes */
    if (instance.classes) {
      instance.classes.add(args.classes);
    }
    /* Use updates */
    instance.update?.(args.updates);
    /* Append children */
    instance.append?.(...args.children);
    /* Call '__init__' to invoke post-config actions */
    instance.__init__?.();
    instance.constructor.__init__?.call(instance);
    /* Call hooks */
    instance.hooks?.(...args.hooks);
    return instance;
  };
};
