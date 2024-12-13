import { camel_to_kebab } from "rollo/utils/case";
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
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      /* Effect complex to control items. */
      const items = new (class {
        #owner;
        constructor(owner) {
          this.#owner = owner;
        }
        get owner() {
          return this.#owner;
        }
        condition = (changes) => {
          return Object.fromEntries(
            Object.entries(changes)
              .filter(
                ([key, value]) =>
                  this.owner.is_css(key) &&
                  (typeof value === "string" || value === false)
              )
              .map(([key, value]) => [
                camel_to_kebab(key.trim()),
                typeof value === "string" ? value.trim() : value,
              ])
          );
        };
        effect = (changes) => {
          const style = this.owner.rule.style;
          for (const [key, value] of Object.entries(changes)) {
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
      /* Add effect to control items effect */
      this.effects.add((changes, previous) => {
        if (this.rule) {
          this.effects.add(items.effect, items.condition);
        } else {
          this.effects.remove(items.effect);
        }
      }, "rule");
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
        typeof key === "string" && (key.startsWith("--") || key in super.style)
      );
    }
  };

  return cls;
};
