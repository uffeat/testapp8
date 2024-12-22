import { Chain } from "rollo/type/tools/chain";

/* TODO
 */

/* Utility for composing and instantiating classes. 
Provides a touch of Python-flavor to class usage.
Notable features:
- Factory-based simulated multiple inheritance with support for 'super'.
- Registry inspired by web components.
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

  /* Returns macro controller. */
  get macros() {
    return this.#macros;
  }
  #macros = new (class Macro {
    #owner;
    #registry = new Set();
    constructor(owner) {
      this.#owner = owner;
    }

    /* Registers and returns macro. */
    add(macro) {
      if (import.meta.env.DEV) {
        if (this.#registry.has(macro)) {
          console.info(`Replaced registered macro: ${macro.name}.`);
        } else {
          console.info(`Registered macro: ${macro.name}.`);
        }
      }
      this.#registry.add(macro);
      return macro;
    }

    /* Calls registered macros. */
    call(tag, ...args) {
      /* Iterate over a copy of values to allow macros to safely remove 
      themselves from registry. */
      for (const macro of [...this.#registry.values()]) {
        const result = macro.call(this.#owner, tag, ...args);
        if (result) return result
      }
    }

    /* Removes macro. */
    remove(macro) {
      this.#registry.delete(macro);
    }
  })(this);

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
      - factories can perform checks (as they receive the 'factories')
      ... or, more elegantly,
      - factory classes can be given a static 'dependencies' array, which
        is automatically checked against 'factories' during composition.
    - By soft inconsequential convention, the name of a factory function and 
      name of the class it returns should be the same and in snake-case. 
      This can be useful during chain  inspection to signal that a given class 
      was injected into the chain by a factory. */
    const chain = [cls];
    for (const factory of factories) {
      cls = factory(cls, config, ...factories);
      if (cls.dependencies) {
        check_factory_dependencies(cls.dependencies, factories);
      }
      chain.push(cls);
    }
    return cls;
  }

  /* Returns instance of registered class.
  - Uses the 'constructed_callback' lifecycle method. 
  - Does NOT use the standard 'create' pattern.
  NOTE
  - 'config' is specialized alternative to 'create' that can be used, when 
    polymorphism and/or special configuration is required during creation. 
  */
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
      delete instance.constructed_callback;
    }
    return instance;
  }

  /* Returns instance of registered class.
  - Uses the standard 'create' pattern.
  - Uses the 'created_callback' lifecycle method. 
  NOTE
  - 'create' is the workhorse of the 'type' object. 
  */
  create(tag, ...args) {
    /* Get class from registry */
    const cls = this.get(tag, ...args);
    /* Create instance */
    let instance;
    if (cls.create) {
      instance = cls.create(...args);
    } else {
      instance = new cls(...args);
    }
    /* Call the 'created_callback' lifecycle method */
    if (instance.created_callback) {
      instance.created_callback();
      /* Prevent 'created_callback' from being used onwards */
      delete instance.created_callback;
    }
    return instance;
  }

  /* Calls macros and returns registered class.  
  NOTE
  - Throws error, if invalid tag.
  - Use 'registry.get' instead to attempt getting registered class without 
    potential exception. 
  */
  get(tag, ...args) {
    const cls = this.registry.get(tag);
    if (cls) return cls; 
    


    const result = this.macros.call(tag, ...args)
    if (result) {
      
    }

    //throw new Error(`Type '${tag}' not registered.`);
    
    
    return cls;
  }

  /* Adds meta data to, registers and returns a class. 
  NOTE
  - Use 'registry.add' instead to register without adding meta data. 
  */
  register(tag, cls) {
    add_meta_property(cls.prototype, "class", cls);
    add_meta_property(cls.prototype, "type", tag);
    add_meta_property(cls.prototype, "chain", Chain.create(cls));
    return this.registry.add(tag, cls);
  }
})();

/* Adds meta property to target. */
function add_meta_property(target, name, value) {
  Object.defineProperty(target, `__${name}__`, {
    configurable: false,
    enumerable: false,
    writable: false,
    value,
  });
  return target;
}

/* Checks factory dependencies */
function check_factory_dependencies(dependencies, factories) {
  const missing = new Set(dependencies).difference(new Set(factories));
  if (missing.size > 0) {
    const names = Array.from(missing).map((factory) => factory.name);
    throw new Error(`Missing factories: ${names}`);
  }
}
