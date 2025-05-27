/*
import vars from "@/rollocomponent/mixins/vars.js";
20250527
v.1.0
*/

/* TODO
- Implement 'update' method for batch updates; use the '__' prefix 
  ('update' in 'props' mixin already preparred for this).
- Currently the getter uses to different approaches depending on connection.
  I'm under the impression that the 'connected' approach is the best practice, but not sure?
  If the 'connected' approach is superior, warn, if not connected.
  If the 'disconnected' approach is just as good, use this as the single approach. 
- If ever needed: Relatively easy to store CSS vars (current and previous) in 
  custom registry. This could track changes and only make updates, if actual 
  change. Could also be a step towards component serialization/deserialization.
- If ever needed: Relatively easy to make CSS vars reactive, by event 
  dispatch. This could open up for very powerful pattern in combination with 
  dynamic sheets and a set of naming rules; e.g.:
  - A CSS var is set, e.g., 'color'
  - A reaction triggers the creation of a rule in a dynamic sheet, if such a 
    rule does not already exist, e.g., * { color: var(--color);}
  - The component can now use it's CSS var to set color in a way that does 
    not rely on 'style' props.
  - With the right naming conventions in place, this concept could also cover
    pseudo-selectors and responsiveness, e.g, 'color:hover:md'... This in turn
    would provide Tailwind functionality with much less overhead and much 
    greater flexibility! */

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();

      this.#_.vars = new Proxy(this, {
        get(target, name) {
          /* Normalize name */
          if (!name.startsWith("--")) {
            name = `--${name}`;
          }
          /* By convention, false signals absence of CSS var */
          if (target.isConnected) {
            const value = getComputedStyle(target)
              .getPropertyValue(name)
              .trim();
            if (!value) return false;
            const priority = target.style.getPropertyPriority(name);
            if (priority) return `${value} !${priority}`;
            return value;
          }
          /*  */
          const value = target.style.getPropertyValue(name);
          if (!value) return false;
          const priority = target.style.getPropertyPriority(name);
          if (priority) return `${value} !${priority}`;

          return value;
        },
        set(target, name, value) {
          /* Normalize name */
          if (!name.startsWith("--")) {
            name = `--${name}`;
          }
          /* By convention, false removes */
          if (value === false) {
            target.style.removeProperty(name);
          } else {
            /* Handle priority */
            value = value.trim();
            if (value.endsWith("!important")) {
              target.style.setProperty(
                name,
                value.slice(0, -"!important".length),
                "important"
              );
            } else {
              target.style.setProperty(name, value);
            }
          }
          return true;
        },
      });
    }

    /* Provides access to single CSS var without use of strings. */
    get vars() {
      return this.#_.vars;
    }
  };
};
