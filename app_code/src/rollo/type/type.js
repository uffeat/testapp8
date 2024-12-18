/* Utility for authoring instantiating classes. 
Notable features:
- Factory-based simulated multiple inheritance.
- Object registry inspired by web components.
- Unified instantiation from registered classes with support for:
  - Custom life-cycle methods.
  - Standard methods called in a standard order

*/
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
          console.info(`Replaced registered type: ${tag}.`);
        } else {
          console.info(`Registered type: ${tag}.`);
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

  /* Builds, registers and returns class from native base, config and factories.
  Simulates multiple inheritance. */
  author = (tag, base, config, ...factories) => {
    /* NOTE
    - 'factories' is passed into each factory, so that the individual factory 
      is aware of it's siblings. Factories can, but should generally not, 
      mutate 'factories'. 
    - 'config' is passed into each factory. 'config' can be an object that 
      instructs factories. Factories can, but should generally not, mutate 
      'config'. */
    const _factories = [...factories];
    let cls = factories.shift()(base, config, ..._factories);
    const chain = [base, cls];
    const names = [];
    if (cls.name) {
      names.push(cls.name);
    }
    /* Build composite class */
    for (const factory of factories) {
      cls = factory(cls, config, ..._factories);
      chain.push(cls);
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
    /* Give cls the ability to mutate its prototype by directly assigning 
    members from other classes. 
    NOTE
    - In addition to usage below, this can be useful for modifying a composite 
      class after it has been built from factories, e.g., when:
      - Something must be done that requires guarantee that all factories have benn 
        implemented.
      - The class should be modified with objects outside its factories.
      Be aware that:
      - Constructors in sources classes are ignored, i.e., cannot be used.
      - Sources classes cannot use 'super' and private fields.
      - Target class members may be overwritten without warning. */
    Object.defineProperty(cls, "assign", {
      configurable: false,
      enumerable: false,
      writable: false,
      value: (...sources) => {
        sources.forEach((source) =>
          Object.defineProperties(
            cls.prototype,
            Object.getOwnPropertyDescriptors(source.prototype)
          )
        );
        return cls;
      },
    });
    /* Add meta */
    const __chain__ = Object.freeze(chain.reverse());
    const __config__ = Object.freeze(config || {});
    cls.assign(
      class {
        get __chain__() {
          return __chain__;
        }
        get __class__() {
          return cls;
        }
        get __config__() {
          return __config__;
        }
        get type() {
          return tag;
        }
      }
    );
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
      /* Prevent 'constructed_callback' from being used onwards */
      self.constructed_callback = undefined;
    }
    /* Call the 'update' standard method */
    self.update && self.update(updates);
    /* Call the 'call' standard method */
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
