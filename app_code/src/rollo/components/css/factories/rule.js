import { check_factories } from "rollo/utils/check_factories";
import { items } from "rollo/factories/__factories__";
import { target } from "rollo/components/css/factories/target";

/* Factory for rule prop. */
export const rule = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([items, target], factories);
  const cls = class Rule extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);

      /* Add effect to control rule */
      this.effects.add((changes, previous) => {
        /* Disengage from any previous target */
        if (previous.target) {
          /* Remove rule from previous target */
          previous.target.rules && previous.target.rules.remove(this.rule);
          /* Reset rule */
          this.$.rule = null;
        }
        /* Engage with any current target */
        if (this.target) {
          /* Create and add rule without items */
          const tag = this.tagName.toLowerCase();
          if (tag === "css-keyframe") {
            this.$.rule = this.target.rules.add(this.frame);
          } else if (tag === "css-keyframes") {
            this.$.rule = this.target.rules.add(`@keyframes ${this.name}`);
          } else if (tag === "css-media") {
            this.$.rule = this.target.rules.add(`@media`);
          } else if (tag === "css-rule") {
            this.$.rule = this.target.rules.add(`${this.selector}`);
          } else {
            throw new Error(`Invalid tag: ${tag}`);
          }
        }
      }, "target");
    }

    /* Returns CSS rule state. */
    get rule() {
      return this.$.rule;
    }
  };
  return cls;
};
