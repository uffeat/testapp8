export const elements = (parent, config, ...factories) => {
  return class extends parent {
    static name = "elements";

    get elements() {
      return this.#elements;
    }
    #elements = factory(this);
  };
};

function factory(owner) {
  const cache = new Map();
  return new Proxy(owner, {
    get(target, key) {
      let element = cache.get(key);
      if (element) {
        return element;
      }
      element = target.querySelector(`[name="${key}"]`) || null;
      cache.set(key, element);
      return element;
    },
    set(target, key, value) {
      if (value instanceof HTMLElement) {
        cache.set(key, value);
        if (!target.contains(value)) {
          target.append(value);
        }
        if (value.name !== key) {
          value.name = key;
        }
      } else if (value === null) {
        const element = cache.get(key);
        if (element) {
          cache.delete(key);
          if (target.contains(element)) {
            element.remove();
          }
        }
      } else {
        throw new Error(`Invalid value: ${String(value)}`)
      }
      return true;
    },
  });
}
