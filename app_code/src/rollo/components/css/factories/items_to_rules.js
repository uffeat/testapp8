import { camel_to_kebab } from "rollo/utils/case";
import { Data } from "rollo/utils/data";
import { check_factories } from "rollo/utils/check_factories";
import { attribute, items } from "rollo/factories/__factories__";
import { rule } from "rollo/components/css/factories/rule";

/* . */
export const items_to_rules = (parent, config, ...factories) => {
  check_factories([attribute, items, rule], factories);
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
        #owner;
        constructor(owner) {
          this.#owner = owner;
          /* Add effect to control items effect */
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
        condition = (changes) => {
          if (!(changes instanceof Data)) {
            changes = Data.create(changes)
          }
          return changes
            .filter(
              ([key, value]) =>
                this.owner.is_css(key) &&
                (typeof value === "string" || value === false)
            )
            .map(([key, value]) => [
              camel_to_kebab(key.trim()),
              typeof value === "string" ? value.trim() : value,
            ]);
        };
        effect = (changes) => {
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
      this.items.update(updates);
      return this;
    }

    /* Checks if key is a valid CSS key. */
    is_css(key) {
      return (
        typeof key === "string" && (key.startsWith("--") || key in this.style)
      );
    }
  };

  return cls;
};
