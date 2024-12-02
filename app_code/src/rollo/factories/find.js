/* Factory for all web components. */
export const find = (parent, config, ...factories) => {
  const cls = class Find extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Returns array of unique descendant elements that match ANY selectors. 
    Returns null, if no matches.
    A more versatile alternative to querySelectorAll with a return value 
    that array methods can be used directly on (unless null) */
    find(...selectors) {
      const elements = [
        ...new Set(
          selectors
            .map((selector) => [...this.querySelectorAll(selector)])
            .flat()
        ),
      ];
      return elements.lenght === 0 ? null : elements;
    }
  };
  return cls;
};
