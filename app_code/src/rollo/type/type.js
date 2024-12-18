import { assign } from "rollo/utils/assign";

export const type = new (class Type {
  get registry() {
    return this.#registry;
  }
  #registry = new (class Registry {
    #registry = {};
    /*  */
    add = (tag, cls) => {
      if (import.meta.env.DEV) {
        if (tag in this.#registry) {
          console.info(`Replaced registered type with tag: ${tag}.`);
        } else {
          console.info(`Registered type with tag: ${tag}.`);
        }
      }

      this.#registry[tag] = cls;

      return cls;
    };
    /*  */
    get = (tag) => {
      return this.#registry[tag];
    };
  })();

  /* Builds, registers and returns class from native base, config and factories. */
  author = (tag, base, config, ...factories) => {
    const _factories = [...factories];
    let cls = factories.shift()(base, config, ..._factories);
    const names = [];
    if (cls.name) {
      names.push(cls.name);
    }

    /* Build composite class */
    for (const factory of factories) {
      cls = factory(cls, config, ..._factories);
      /* Check name */
      if (cls.name) {
        if (names.includes(cls.name)) {
          console.warn(
            `Factory class names should be unique for better traceability. Got duplicate: ${cls.name}`
          );
        }
        names.push(cls.name);
      }
    }
    /* Add meta */
    assign(cls.prototype, (class {
      get tag() {
        return tag
      }
    }).prototype)

    /* Register and return class */
    return this.registry.add(tag, cls);
  };

  /* Returns instance of class. */
  create = (tag, { config = {}, ...updates } = {}, ...hooks) => {
    /* Get class from registry */
    const cls = this.registry.get(tag);
    if (!cls) {
      throw new Error(`No type with tag '${tag}' not registered.`);
    }
    /* Create instance */
    let self = new cls();

    /* Call the 'constructed_callback' lifecycle method */
    if (self.constructed_callback) {
      const result = element.constructed_callback(config);
      /* Allow truthy result to replace instance */
      if (result) {
        self = result;
      }
      /* Prevent 'created_callback' from being used onwards */
      self.constructed_callback = undefined;
    }

    /* Call the 'update' lifecycle method */
    self.update && self.update(updates);

    /* Call the 'call' lifecycle method */
    self.call && self.call(...hooks);

    /* Call the 'created_callback' lifecycle method */
    if (self.created_callback) {
      self.created_callback && self.created_callback();
      /* Prevent 'created_callback' from being used onwards */
      self.created_callback = undefined;
    }

    return self;
  };
})();
