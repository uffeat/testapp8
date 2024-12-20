const META_PROPERTY_OPTIONS = Object.freeze({
  configurable: false,
  enumerable: false,
  writable: false,
});

/* Utility for authoring instantiating classes. 
Notable features:
- Factory-based simulated multiple inheritance.
- Object registry inspired by web components.
- Unified instantiation from registered classes with standardized factory 
  patterns. */
export const type = new (class Type {
  /* Returns registry controller. */
  get registry() {
    return this.#registry;
  }
  #registry = new (class Registry {
    #registry = {};
    /* Registers and returns class. */
    add(tag, cls) {
      if (import.meta.env.DEV) {
        if (tag in this.#registry) {
          console.info(`Replaced registered type: ${tag}.`);
        } else {
          console.info(`Registered type: ${tag}.`);
        }
      }

      this.#registry[tag] = cls;
      return cls;
    }
    /* Returns registered class. */
    get(tag) {
      return this.#registry[tag];
    }
  })();

  /* Builds composite class */
  compose(cls, config = {}, ...factories) {
    cls = cls || class {};
    const chain = [cls];
    for (const factory of factories) {
      cls = factory(cls, config, ...factories);
      /* Handle chain */
      chain.push(cls);
    }
    /* */
    add_meta_property(cls, 'chain', Object.freeze(chain))

    return cls;
  }

  /* . */
  config(tag, config) {
    /* Get class from registry */
    const cls = this.get(tag);
    /* Create instance */
    let instance = new cls();
    /* Call the 'constructed_callback' lifecycle method */
    if (instance.constructed_callback) {
      instance = instance.constructed_callback(config) || instance;
      /* Prevent 'constructed_callback' from being used onwards */
      instance.constructed_callback = undefined;
    }
    return instance;
  }

  /* Returns instance of class. */
  create(tag, ...args) {
    /* Get class from registry */
    const cls = this.get(tag);
    /* Create instance */
    let instance;
    if (cls.create) {
      instance = cls.create(...args);
    } else {
      instance = new cls(...args);
    }
    /* Call the 'created_callback' lifecycle method */
    if (instance.created_callback) {
      const result = instance.created_callback();
      /* Allow truthy result to replace instance */
      if (result) {
        instance = result;
      }
      /* Prevent 'created_callback' from being used onwards */
      instance.created_callback = undefined;
    }
    return instance;
  }

  /* */
  get(tag) {
    const cls = this.registry.get(tag);
    if (!cls) {
      throw new Error(`Type '${tag}' not registered.`);
    }
    return cls;
  }

  /* */
  register(tag, cls) {
    
    add_meta_property(cls.prototype, "class", cls)

    Object.defineProperty(cls.prototype, "__type__", {
      ...META_PROPERTY_OPTIONS,
      value: tag,
    });

    if (cls.__chain__) {
      Object.defineProperty(cls.prototype, "__chain__", {
        ...META_PROPERTY_OPTIONS,
        value: Chain.create(...cls.__chain__, cls),
      });
    }

    return this.registry.add(tag, cls);
  }
})();

/* */
export function assign(cls, ...sources) {
  sources.forEach((source) =>
    Object.defineProperties(
      cls.prototype,
      Object.getOwnPropertyDescriptors(source.prototype)
    )
  );
  return cls;
}

/* */
function add_meta_property(target, name, value) {
  Object.defineProperty(target, `__${name}__`, {
    configurable: false,
    enumerable: false,
    writable: false,
    value,
  });
  return target;
}

/* */
class Chain {
  static create = (...args) => {
    return new Chain(...args);
  };
  constructor(...classes) {
    this.#classes = Object.freeze(
      Object.fromEntries(classes.map((cls) => [cls.name, cls]))
    );
    this.#list = Object.freeze(classes);
    this.#names = Object.freeze(classes.map((cls) => cls.name));
  }

  /* Returns (frozen) name-class object for classes in chain. */
  get classes() {
    return this.#classes;
  }
  #classes;

  /* Returns (frozen) array of classes in chain. */
  get list() {
    return this.#list;
  }
  #list;

  /* Returns (frozen) array of names of classes in chain. */
  get names() {
    return this.#names;
  }
  #names;

  /* Returns number of classes in chain. */
  get size() {
    return this.#list.length;
  }
}
