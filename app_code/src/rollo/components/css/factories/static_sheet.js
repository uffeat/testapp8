import { check_factories } from "rollo/utils/check_factories";
import { attribute, connected, items } from "rollo/factories/__factories__";

/* Factory that wraps a constructed sheet.
Responsibilities:
- Adoption to/unadoption from a single target.
- Control sheet's 'disabled' state.
NOT concerned with sheet content. */
export const sheet = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, connected, items], factories);

  const cls = class Sheet extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      
    }

    
  };
  return cls;
};
