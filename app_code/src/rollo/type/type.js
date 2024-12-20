/* Utility for composing and instantiating classes. 
Provides a touch of Python-flavor to class usage.
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

  /* Builds, adds meta data to, and returns composite class from optional 
  base class, optional configuration and factories. */
  compose(cls, config = {}, ...factories) {
    /* NOTE
    - Simulates multiple inheritance.
    - 'factories' is passed into each factory, so that the individual factory 
      is aware of it's siblings.
    - 'config' is passed into each factory. 'config' can be an object that 
      instructs factories. 
    - Factories can, but should generally not, mutate 'config' and 'factories'. 
    - Factories may depend on each other. To ensure that such dependencies 
      are not broken
      - factories can perform any checks (as they receive the 'factories')
      ... or, more elegantly
      - factory classes can be given a static 'dependencies' array, which
        is automatically checked against 'factories' during composition.
    - By convention, the name of factory function and name of the class it 
      returns should be the same and in snake-case. This can be useful during chain 
      inspection to signal that a given class was injected into the chain by 
      a factory. However, this is just a soft convention and breaking it has 
      no consequence. */
    cls = cls || class {};
    const chain = [cls];
    for (const factory of factories) {
      cls = factory(cls, config, ...factories);
      if (cls.dependencies) {
        check_factory_dependencies(cls.dependencies, factories);
      }
      chain.push(cls);
    }
    /* Add '__chain__' meta property to cls */
    add_meta_property(cls, "chain", Object.freeze(chain));
    return cls;
  }

  /* Returns instance of registered class.
  - Uses the 'constructed_callback' lifecycle method. 
  - Does NOT use the standard 'create' pattern.
  NOTE
  - 'config' is specialized alternative to 'create' that can be used, when 
    polymorphism and/or special configuration is required during creation. */
  config(tag, config, ...args) {
    /* Get class from registry */
    const cls = this.get(tag);
    /* Create instance */
    let instance = new cls();
    /* Call the 'constructed_callback' lifecycle method */
    if (instance.constructed_callback) {
      /* Allow truthy result to replace instance */
      instance = instance.constructed_callback(config, ...args) || instance;
      /* Prevent 'constructed_callback' from being used onwards */
      instance.constructed_callback = undefined;
    }
    return instance;
  }

  /* Returns instance of registered class.
  - Uses the standard 'create' pattern.
  - Uses the 'created_callback' lifecycle method. 
  NOTE
  - 'create' is the workhorse of the 'type' object. */
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
      /* Allow truthy result to replace instance */
      instance = instance.created_callback() || instance;
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
    add_meta_property(cls.prototype, "class", cls);
    add_meta_property(cls.prototype, "type", tag);
    if (cls.__chain__) {
      add_meta_property(
        cls.prototype,
        "chain",
        Chain.create(...cls.__chain__, cls)
      );
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

/* Controller for access to classes in prototype chain. */
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

/* Add meta property to target. */
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
function check_factory_dependencies(dependencies, factories) {
  const missing = new Set(dependencies).difference(new Set(factories));
  if (missing.size > 0) {
    const names = Array.from(missing).map((factory) => factory.name);
    throw new Error(`Missing factories: ${names}`);
  }
}
