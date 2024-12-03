/*
TODO
- rules should drive insertion of sheet component
- Consider, which functionality should be in sheet component vs. this component
- Auto-scope by prefixing selector
- Insert rule with var value for smoother updates

*/



/* Factory for all web components. */
export const sheet = (parent, config, ...factories) => {
  const cls = class Sheet extends parent {
    constructor(...args) {
      super(...args);
    }

    /*  
    get style() {
      if (this.sheet) {
        return this.#style;
      }
      return super.style;
    }
    #style = new Proxy(this, {
      get: (target, key) => {
        // TODO
        return;
      },
      set: (target, key, value) => {
        console.log(key); ////

        if (target.isConnected) {
          document.adoptedStyleSheets.push(this.sheet.sheet);
        }

        //target.sheet.create_rule(selector, {key, value})

        //console.log(rule)////

        return true;
      },
    });

     */

    // TODO Perhaps use connected state instead

    

    get sheet() {
      return this.querySelector("sheet-component");
    }



    /* */
    get rules() {
      return this.#rules;
    }
    #rules = new (class {
      /* . */
      #owner;
      constructor(owner) {
        this.#owner = owner;
      }

      add = (...rules) => {
        for (const rule of rules) {
          const selector = Object.keys(rule)[0]
          const items = Object.values(rule)[0]

          ////console.log('selector:', selector)////
          ////console.log('items:', items)////
          ////console.log(this.#owner.sheet)////

          this.#owner.sheet.create_rule(selector, items)
          
        }
       
        return this.#owner;
      };

      has = () => {
        
      };

      remove = () => {
        
        return this.#owner;
      };

      
    })(this);




  };
  return cls;
};
