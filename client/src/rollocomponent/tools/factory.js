import { Args } from "@/rollocomponent/tools/args.js";

/* Returns instance factory function for cls. */
export const factory = (cls) => {
  self = new cls();
  
  return (...args) => {
    /* Parse args */
    args = new Args(args);
    /* Add CSS classes */
    self.classes.add(args.classes);
    /* Use updates */
    self.update(args.updates);
    /* Append children */
    self.append(...args.children);
    /* Call '__new__' to do stuff not allowed in constructors. */
    self.__new__?.();
    /* '__new__' is for factory use only, so remove */
    delete self.__new__;
    /* Call hooks and return instance */
    return self.hooks(...args.hooks);
  };
};