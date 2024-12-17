import { Component } from "rollo/component";
import { Data } from "rollo/types/data";
import { attribute, items } from "rollo/factories/__factories__";

/* Factory that shows state as attribute. */
export const item_to_attribute = (parent, config, ...factories) => {
  /* Check factory dependencies */
  Component.factories.check([attribute, items], factories);

  const cls = class ItemToAttribute extends parent {
    static ANTI_PREFIX = "$";

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
      this.items.effects.add((changes) => {
        //
        //
        //
        if (!(changes instanceof Data)) {
          console.warn(`Expected 'changes' to be a Data instance. It's not!`);
          changes = Data.create(changes);
        }
        //
        //
        if (!changes.size) return;
        changes
          .filter(
            ([k, v]) =>
              typeof k === "string" &&
              /* Exclude items set up to shadow props; it's up to the prop to sync attr */
              !k.startsWith(ItemToAttribute.ANTI_PREFIX) &&
              ["boolean", "number", "string"].includes(typeof v)
          )
          .forEach(([k, v]) => {
            /* By convention and to reduce risk of unintended effects,
            keys that are also props in base proto are prefixed with 'state- */
            if (k in this.__base__.prototype) {
              this.attribute[`state-${k}`] = v;
            } else {
              this.attribute[k] = v;
            }
          });
      });
    }
  };
  return cls;
};
