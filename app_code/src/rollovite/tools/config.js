export class Config {
  #import;
  #raw
  #types;
  constructor() {
    this.#import = new (class Import {
      #registry = new Map();

      add(type, name) {
        if (Object.isFrozen(this.#registry)) {
          throw new Error(`Frozen.`);
        }
        this.#registry.set(type, name)
        return this;
      }

      get(type) {
        return this.#registry.get(type)
      }

      freeze() {
        if (Object.isFrozen(this.#registry)) {
          throw new Error(`Already frozen.`);
        }
        this.#registry = Object.freeze(this.#registry);
        return this;
      }

    })();

    this.#raw = new (class Raw {
      #registry = new Set();

      get types() {
        if (!Object.isFrozen(this.#registry)) {
          throw new Error(`Cannot access unfrozen.`);
        }
        return this.#registry;
      }

      add(...types) {
        if (Object.isFrozen(this.#registry)) {
          throw new Error(`Frozen.`);
        }
        types.forEach((type) => this.#registry.add(type))
        return this;
      }

      freeze() {
        if (Object.isFrozen(this.#registry)) {
          throw new Error(`Already frozen.`);
        }
        this.#registry = Object.freeze(this.#registry);
        return this;
      }

    })();






    this.#types = new (class Types {
      #registry = new Set();

      get types() {
        if (!Object.isFrozen(this.#registry)) {
          throw new Error(`Cannot access unfrozen.`);
        }
        return this.#registry;
      }

      add(...types) {
        if (Object.isFrozen(this.#registry)) {
          throw new Error(`Frozen.`);
        }
        types.forEach((type) => this.#registry.add(type))
        return this;
      }

      freeze() {
        if (Object.isFrozen(this.#registry)) {
          throw new Error(`Already frozen.`);
        }
        this.#registry = Object.freeze(this.#registry);
        return this;
      }
    })();
  }

  get import() {
    return this.#import;
  }

  get raw() {
    return this.#raw;
  }

  get types() {
    return this.#types;
  }
}
