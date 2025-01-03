import { camel_to_kebab } from "@/rollo/tools/str/case";
import { Component } from "rollo/component";
import { Data } from "rollo/types/data";
import { attribute, items } from "rollo/factories/__factories__";
import { is_css } from "rollo/components/css/factories/is_css";
import { rule } from "rollo/components/css/factories/rule";

/* . */
export const items_to_rules = (parent, config, ...factories) => {
  Component.factories.check([attribute, is_css, items, rule], factories);
  const cls = class ItemsToRules extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      /* Effect complex to let items control rules. */
      new (class {
        constructor(owner) {
          this.#owner = owner;
          owner.effects.add(() => {
            if (owner.rule) {
              owner.effects.add(this.effect, this.condition);
            } else {
              owner.effects.remove(this.effect);
            }
          }, "rule");
        }
        get owner() {
          return this.#owner;
        }
        #owner;
        condition = (changes) => {
          return Data.create(changes)
            .filter(
              ([k, v]) =>
                this.owner.is_css(k) && (typeof v === "string" || v === false)
            )
            .map(([k, v]) => [
              camel_to_kebab(k.trim()),
              typeof v === "string" ? v.trim() : v,
            ]);
        };
        effect = (changes) => {
          if (changes.size === 0) return;
          const style = this.owner.rule.style;
          for (const [key, value] of changes.entries) {
            if (value === false) {
              /* false is a cue to remove */
              style.removeProperty(key);
            } else {
              /* Update rule */
              if (value.endsWith("!important")) {
                style.setProperty(
                  key,
                  value.slice(0, -"!important".length),
                  "important"
                );
              } else {
                style.setProperty(key, value);
              }
            }
            /* Sync to attribute */
            this.owner.attribute[key] = value;
          }
        };
      })(this);
    }

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Allow updating items without the '$'-syntax */
      this.items.update(
        Data.create(updates).filter(([k, v]) => this.is_css(k))
      );
      return this;
    }
  };

  return cls;
};
