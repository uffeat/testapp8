/* Factory with features for selecting and removing descendant elements. */
export const descendants = (parent, config, ...factories) => {
  const cls = class Descendants extends parent {
    get descendants() {
      return this.#descendants;
    }
    #descendants = new (class {
      #owner;
      constructor(owner) {
        this.#owner = owner;
      }

      /* Returns array of unique descendants that match ANY selectors. 
      Returns null, if no matches.
      A more versatile alternative to querySelectorAll with a return value 
      that array methods can be used directly on (unless null). */
      get = (...selectors) => {
        const elements = [
          ...new Set(
            selectors
              .map((selector) => [...this.#owner.querySelectorAll(selector)])
              .flat()
          ),
        ];
        return elements.lenght === 0 ? null : elements;
      };

      /* Removes all children. Chainable. */
      clear = () => {
        while (this.#owner.firstChild) {
          this.#owner.firstChild.remove();
        }
        return this.#owner;
      };

      /* Removes descendants that match ANY selectors. 
      Returns removed descendants or null, if none removed. */
      remove = (...selectors) => {
        const elements = this.get(...selectors);
        elements && elements.forEach((element) => element.remove());
        return elements;
      };
    })(this);
  };
  return cls;
};
