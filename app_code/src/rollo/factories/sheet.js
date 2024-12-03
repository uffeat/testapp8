/*
TODO
- rules should drive insertion of sheet component
- Consider, which functionality should be in sheet component vs. this component
- Auto-scope by prefixing selector
- Insert rule with var value for smoother updates

*/

const create_scope = (() => {
  let count = 0;
  return () => {
    return `_scope${count++}`;
  };
})();

/* Factory for all web components. */
export const sheet = (parent, config, ...factories) => {
  const cls = class Sheet extends parent {
    #scope
    #sheet;
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

    #create_sheet = () => {
      if (!this.#sheet) {
        this.#sheet = new CSSStyleSheet();
        this.#scope = create_scope()
        /* Add effect to adopt/unadopt */
        this.effects.add((data) => {
          if (this.$.connected) {
            this.classList.add(this.#scope)
            console.log("Adopting sheet"); ////
            document.adoptedStyleSheets.push(this.#sheet)
          } else {
            const index = document.adoptedStyleSheets.indexOf(this.#sheet);
            if (index !== -1) {
              console.log("Unadopting sheet"); ////
              document.adoptedStyleSheets.splice(index, 1);
            }
            this.classList.add(this.#scope)
          }
        }, "connected");
      }
    };

    /*  */
  #create_rule = (selector, items) => {
    if (!this.#sheet) {
      throw new Error(`Sheet not created`)
      
    }
    // TODO use css var as key
    // TODO Validate

    selector = `:is(.${this.#scope})${selector}`


    const index = this.#sheet.insertRule(`${selector} {}`, this.size);
    const rule = this.#sheet.cssRules[index];

    for (const [key, value, important] of Object.entries(items)) {
      rule.style.setProperty(key, value, important ? "important" : "");
      console.log("key:", key); ////
      console.log("value:", value); ////
    }

    

    //return rule;
  };


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
        this.#owner.#create_sheet()
        

        for (const rule of rules) {
          const selector = Object.keys(rule)[0];
          const items = Object.values(rule)[0];

          ////console.log('selector:', selector)////
          ////console.log('items:', items)////
          ////console.log(this.#owner.sheet)////

          this.#owner.#create_rule(selector, items);
        }

        return this.#owner;
      };

      has = () => {};

      remove = () => {
        return this.#owner;
      };
    })(this);
  };
  return cls;
};
