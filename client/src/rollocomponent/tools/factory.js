import { Args } from "@/rollocomponent/tools/args.js";

/* Returns instance factory function for cls. */
export const factory = (cls) => {
  const instance = new cls();
  
  return (...args) => {
    /* Parse args */
    args = new Args(args);
    /* Add CSS classes */
    instance.classes.add(args.classes);
    /* Use updates */
    instance.update(args.updates);
    /* Append children */
    instance.append(...args.children);
    /* Call '__new__' to do stuff not allowed in constructors. */
    instance.__new__?.();
    /* '__new__' is for factory use only, so remove */
    delete instance.__new__;
    /* Call hooks and return instance */
    return instance.hooks(...args.hooks);
  };
};