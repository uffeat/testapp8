/* 
20250402
src/rollo/component/factories/content.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/content.js
import { content, elements } from "rollo/component/factories/content.js";
*/

export const content = (parent, config, ...factories) => {
  return class extends parent {
    static name = "content";

    #html;

    __new__() {
      super.__new__?.();
      this.#html = new (class Html {
        #insert;
        constructor(owner) {
          this.#insert = new (class Insert {
            afterbegin(html) {
              html && owner.insertAdjacentHTML("afterbegin", html);
              return owner;
            }
            afterend(html) {
              html && owner.insertAdjacentHTML("afterend", html);
              return owner;
            }
            beforebegin(html) {
              html && owner.insertAdjacentHTML("beforebegin", html);
              return owner;
            }
            beforeend(html) {
              html && owner.insertAdjacentHTML("beforeend", html);
              return owner;
            }
          })();
        }
        get insert() {
          return this.#insert;
        }
      })(this);
    }

    /* Returns html controller. */
    get html() {
      return this.#html;
    }

    /* Appends children. Chainable. */
    append(...children) {
      super.append(...children.filter((c) => c));
      return this;
    }

    /* Clears content, optionally subject to selector. Chainable. */
    clear(selector) {
      if (selector) {
        const result = this.find(selector);
        if (Array.isArray(result)) {
          result.forEach((e) => e.remove());
        } else if (result instanceof HTMLElement) {
          result.remove();
        }
      } else {
        /* Remove child elements in a memory-safe way. */
        while (this.firstElementChild) {
          this.firstElementChild.remove();
        }
        /* Remove any residual text nodes */
        this.innerHTML = "";
      }
      return this;
    }

    /* Returns single or array of descendant elements - or null, if none found. 
    NOTE
    - Can be used as a querySelector/querySelectorAll hybrid.
    - Can be used to perform function-based search among children. */
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

    /* Prepends children. Chainable. */
    prepend(...children) {
      super.prepend(...children.filter((c) => c));
      return this;
    }
  };
};

export const elements = (parent, config, ...factories) => {
  return class extends parent {
    static name = "elements";

    #elements;

    __new__() {
      super.__new__?.();
      this.#elements = new (class Elements {
        #insert;
        constructor(owner) {
          this.#insert = new (class Insert {
            afterbegin(...elements) {
              elements
                .reverse()
                .forEach(
                  (e) => e && owner.insertAdjacentElement("afterbegin", e)
                );
              return owner;
            }
            afterend(...elements) {
              elements
                .reverse()
                .forEach(
                  (e) => e && owner.insertAdjacentElement("afterend", e)
                );
              return owner;
            }
            beforebegin(...elements) {
              elements.forEach(
                (e) => e && owner.insertAdjacentElement("beforebegin", e)
              );
              return owner;
            }
            beforeend(...elements) {
              elements.forEach(
                (e) => e && owner.insertAdjacentElement("beforeend", e)
              );
              return owner;
            }
          })();
        }
        get insert() {
          return this.#insert;
        }
      })(this);
    }

    /* Returns elements controller. */
    get elements() {
      return this.#elements;
    }
  };
};
