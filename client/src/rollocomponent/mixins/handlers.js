export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.handlers = new (class {
        add(spec = {}) {
          Object.entries(spec).forEach(([type, handler]) => {
            if (type.includes('$')) {
              // TODO add directives, e.g., 'click$once$run'
            }


            owner.addEventListener(type, handler);
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
    }

    get handlers() {
      return this.#_.handlers;
    }
  };
};
