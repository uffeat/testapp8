import { check_factories } from "rollo/utils/check_factories";
import { sheet } from "rollo/components/css/factories/sheet";

/* . */
export const static_sheet = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([sheet], factories);

  const cls = class Sheet extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      
      
    }

    
  };
  return cls;
};
