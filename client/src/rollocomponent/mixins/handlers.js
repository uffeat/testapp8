export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.handlers = new (class {
        add(spec = {}) {
          Object.entries(spec).forEach(([key, handler]) => {
            const [type, ...dirs] = key.split('$')
            if (dirs.includes("once")) {
              const _handler = handler
              handler = (event) => {
                _handler.call(owner, event)
                owner.handlers.remove(type, handler)
              }
             
            }
            owner.addEventListener(type, handler);
           
            if (dirs.includes("run")) {
              handler({owner})
             
            }
          });
          return owner;
        }

        remove(spec = {}) {
          Object.entries(spec).forEach(([type, handler]) => {
            owner.removeEventListener(type, handler);
          });
          return owner;
        }
      })();

      this.#_.on = new Proxy(this, {
        get(target, type) {
          throw new Error(`'on' is write-only.`)
        },
        set(target, key, handler) {
          target.handlers.add(key, handler);
          return true;
        },
      });
    }

    get handlers() {
      return this.#_.handlers;
    }

    get on() {
      return this.#_.on;
    }
  };
};
