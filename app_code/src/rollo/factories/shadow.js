

/* Factory that provides a shadow dom with single slot. 
Call any 'slot_change_callback' on slot change. */
export const shadow = (parent, config, ...factories) => {
 

  const cls = class Shadow extends parent {

    /* Only available during creation. 
    Called:
    - after constructor
    - before CSS classes
    - before 'update' 
    - before children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection 
    NOTE Any (non-undefined) return value replaces component!
    */
    constructed_callback(config) {
      super.constructed_callback && super.constructed_callback(config);
      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(this.slot);
      
    }


    

    
  };
  return cls;
};
