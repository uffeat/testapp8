import { check_factories } from "rollo/utils/check_factories";
import { attribute, items } from "rollo/factories/__factories__";

/* Factory that shows state as attribute. */
export const item_to_attribute = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, items], factories);

  const cls = class ItemToAttribute extends parent {
    static PREFIX = '$'

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      

      /* Show state as attribute */
      this.effects.add((changes) => {
        Object.entries(changes).filter(
          ([key, value]) =>
            !(typeof key === "string" && key.startsWith(ItemToAttribute.PREFIX))
        ).forEach(([key, value]) => {
          if (["boolean", "number", "string"].includes(typeof value)) {
            this.attribute[key] = value;
          } else {
            this.attribute[key] = null;
          }
        })
      });
    }
  };
  return cls;
};
