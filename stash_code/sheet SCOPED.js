const create_scope = (() => {
  let count = 0;
  return () => {
    return `_scope${count++}`;
  };
})();

/*
TODO 
Explore: the component as wrapped around the scoped component(s);
perhaps not as well-suited for injecting on-demand?

*/

// TODO Rename to scoped sheet

export class Sheet extends HTMLElement {
  #parent;
  #scope;
  #sheet;
  constructor() {
    super();
    this.style.display = "none";
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.#scope = create_scope();
    this.#parent = this.parentElement;
    this.#parent.classList.add(this.#scope)
    
    this.#sheet = new CSSStyleSheet();
    console.log("Adopting sheet"); ////
    document.adoptedStyleSheets.push(this.#sheet);
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();

    const index = document.adoptedStyleSheets.indexOf(this.#sheet);
    if (index !== -1) {
      console.log("Unadopting sheet"); ////
      document.adoptedStyleSheets.splice(index, 1);
    }
    this.#parent.classList.remove(this.#scope)
    this.#parent = null;
    this.#scope = null;
    this.#sheet = null;
  }

  /*  */
  create_rule = (selector, items) => {
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

    //console.log(item)////
    //const {key, value, important} = item;

    //

    ////console.log(rule)////

    return rule;
  };

  get scope() {
    return this.#scope;
  }

  get sheet() {
    return this.#sheet;
  }

  /* Returns the number of rules. */
  get size() {
    if (!this.#sheet) {
      throw new Error(`sheet not created.`);
    }
    return this.#sheet.cssRules.length;
  }

  /* Checks declaration key. */
  #validate = (key) => {
    if (!key.startsWith("--")) {
      if (!(key in this.style)) {
        throw new Error(`Invalid key: ${key}`);
      }
    }
  };
}

customElements.define("sheet-component", Sheet);
