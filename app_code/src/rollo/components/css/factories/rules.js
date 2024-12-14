import { check_factories } from "rollo/utils/check_factories";
import { items } from "rollo/factories/__factories__";
import { rule } from "rollo/components/css/factories/rule";
import { RulesController, FrameRulesController } from "rollo/components/css/utils/rules";

/* Factory for rules controller. */
export const rules = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([items, rule], factories);
  const cls = class Rules extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      /* Add effect to control rules */
      this.effects.add(() => {
        if (this.rule) {
          /* Create rules controller for children to engage with */
          if (
            this.rule instanceof CSSGroupingRule
          ) {
            this.$.rules = new RulesController(this.rule);
          } else if (this.rule instanceof CSSKeyframesRule) {
            this.$.rules = new FrameRulesController(this.rule);
          } else {
            throw new Error(`Unsupported rule type: ${this.rule}`);
          }
        } else {
          this.$.rules = null;
        }
      }, "rule");
    }

    /* Return rules controller. */
    get rules() {
      return this.$.rules;
    }
  };
  return cls;
};


