/*
import vars from "@/rollocomponent/mixins/vars.js";
20250530
v.1.2
*/

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
          if (import.meta.env.DEV) {
            console.warn(
              `Reading CSS var '${name}' from a disconnected component may be unreliable.`
            );
          }
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
          /* Guard against no-change. */
          if (value !== target.vars[name]) {
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
          }
          return true;
        },
      });
    }

    /* Provides access to single CSS var without use of strings. */
    get vars() {
      return this.#_.vars;
    }

    /* Updates CSS vars from '__'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);

      /* TODO filter out k.endsWith("__") */

      Object.entries(updates)
        .filter(([k, v]) => k.startsWith("__"))
        .forEach(([k, v]) => {
          this.vars[k.slice("__".length)] = v;
        });

      return this;
    }
  };
};

/* TODO
- If ever needed: Relatively easy to store CSS vars (current and previous) in 
  custom registry. Such a registry could be used to reliably access to CSS 
  vars from disconnected components and  could track changes and only make 
  updates, if actual change. Could also be a step towards component 
  serialization/deserialization.
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
