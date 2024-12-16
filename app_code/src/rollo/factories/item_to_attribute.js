import { Component } from "rollo/component";
import { Data } from "rollo/types/data";
import { attribute, items } from "rollo/factories/__factories__";

/* Factory that shows state as attribute. */
export const item_to_attribute = (parent, config, ...factories) => {
  /* Check factory dependencies */
  Component.factories.check([attribute, items], factories);

  const cls = class ItemToAttribute extends parent {
    static PREFIX = "$";

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      /* Show state as attribute */
      this.effects.add((changes) => {
        if (!(changes instanceof Data)) {
          console.warn(`Expected 'changes' to be a Data instance. It's not!`)
          changes = Data.create(changes);
        }



       
        if (!changes.size) return;
        changes
          .filter(
            ([k, v]) =>
              !(typeof k === "string" && k.startsWith(ItemToAttribute.PREFIX))
          )
          .forEach(([k, v]) => {
            const key = k in this ? `state-${k}` : k;
            if (["boolean", "number", "string"].includes(typeof v)) {
              this.attribute[key] = v;
            } else {
              this.attribute[key] = null;
            }
          });
      });
    }
  };
  return cls;
};
