export const content = (parent, config, ...factories) => {
  return class extends parent {
    static name = "content";

    #html;

    __new__() {
      super.__new__ && super.__new__();
      this.#html = new Html(this);
    }

    /* Returns HTML controller. */
    get html() {
      return this.#html;
    }

    /* . */
    clear(selector) {
      if (selector) {
        const result = this.find(selector);
        if (Array.isArray(result)) {
          result.forEach((e) => e.remove());
        } else if (result instanceof HTMLElement) {
          result.remove();
        }
      } else {
        while (this.firstElementChild) {
          this.firstElementChild.remove();
        }
        this.innerHTML = "";
      }
      return this;
    }

    /* . */
    find(selector) {
      let elements;
      if (typeof selector === "function") {
        elements = Array.from(
          new Set([...this.children].flatMap(selector))
        ).filter((e) => e instanceof HTMLElement);
      } else {
        elements = Array.from(this.querySelectorAll(selector));
      }
      return elements.length > 1 ? elements : elements.at(0) || null;
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
