export const content = (parent, config, ...factories) => {
  return class extends parent {
    static name = "content";

    #html;

    /* Registers default data argument for 'content' effects. */
    __new__() {
      super.__new__ && super.__new__();
      this.#html = new Html(this);
    }

    /* Returns HTML controller. */
    get html() {
      return this.#html;
    }

    /* Removes descendants as per selector. If falsy selector, all child nodes 
    are removed. */
    clear(selector) {
      /* Remove elements */
      let elements;
      if (selector) {
        elements = this.querySelectorAll(selector);
      } else {
        elements = [...this.children];
      }
      elements.forEach((element) => element.remove());
      /* Remove non-element nodes */
      if (!selector) {
        this.innerHTML = "";
      }
      return this;
    }
  };
};

/* HTML controller. */
class Html {
  #owner;

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner component. */
  get owner() {
    return this.#owner;
  }

  /* Inserts html. Chainable with respect to component. */
  insert(html, pos = "beforeend") {
    this.owner.insertAdjacentHTML(pos, html);
    return this.owner;
  }
}
