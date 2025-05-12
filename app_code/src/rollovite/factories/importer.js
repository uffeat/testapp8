import { factory } from "@/rollovite/tools/factory.js";

export const importer = (parent, config, ...factories) => {
  return class Importer extends parent {
    static name = "Importer";

    #importer;

    constructor() {
      super();

      const owner = this;

      this.#importer = new (class Importer {
        create(base) {
          return new (class {
            #factory = factory.call(this);

            /* Returns import with Python-like syntax. */
            get path() {
              return this.#factory;
            }

            /* Returns import. */
            import(path, ...args) {
              return owner.import(`${base}/${path}`, ...args);
            }
          })();
        }
      })();
    }

    /* Returns import with Python-like syntax. */
    get importer() {
      return this.#importer;
    }
  };
};
