import { Chain } from "rollo/type/tools/chain";
import { Macro } from "rollo/type/tools/macro";
import { Registry } from "rollo/type/tools/registry";
import { add_meta } from "rollo/type/tools/add_meta";
import { check_dependencies } from "rollo/type/tools/check_dependencies";

/* Utility for composing and instantiating classes. 
Provides a touch of Python-flavor to class usage.
Notable features:
- Factory-based simulated multiple inheritance with support for 'super'.
- Registry inspired by web components.
- Unified instantiation from registered classes with standardized factory 
  patterns. */
export class Type {
  static create = (...args) => new Type(...args);
  /* Returns registry controller. */
  get registry() {
    return this.#registry;
  }
  #registry = Registry.create();

  /* Returns macro controller. */
  get macros() {
    return this.#macros;
  }
  #macros = Macro.create(this);

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
        check_dependencies(cls.dependencies, factories);
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

  /* Returns registered class.  
  NOTE
  - Calls macros and retries registry, if class not initially found.
  - Throws error, if invalid tag.
  - Use 'registry.get' instead to request registered class without 
    potential exception. 
  */
  get(tag, ...args) {
    let cls = this.registry.get(tag);
    if (cls) return cls;
    /* Give macros a chance to register the requested class */
    this.macros.call(tag, ...args);
    cls = this.registry.get(tag);
    if (cls) return cls;
    throw new Error(`Type '${tag}' not registered.`);
  }

  /* Adds meta data to, registers and returns a class. 
  NOTE
  - Use 'registry.add' instead to register without adding meta data. 
  */
  register(tag, cls) {
    add_meta(cls.prototype, "class", cls);
    add_meta(cls.prototype, "type", tag);
    add_meta(cls.prototype, "chain", Chain.create(cls));
    this.registry.add(tag, cls);
    return cls
  }
}
