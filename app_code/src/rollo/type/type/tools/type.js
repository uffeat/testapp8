import { Chain } from "rollo/type/type/tools/chain";
import { Macro } from "rollo/type/type/tools/macro";
import { Registry } from "rollo/type/type/tools/registry";
import { add_meta } from "rollo/type/type/tools/add_meta";
import { is_class } from "rollo/tools/type/is_class";
import { pascal_to_kebab } from "rollo/tools/str/case";

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
      are not broken factories can perform checks (as they receive the 'factories')
    - By soft inconsequential convention, the name of a factory function and 
      name of the class it returns should be the same and in snake-case. 
      This can be useful during chain inspection to signal that a given class 
      was injected into the chain by a factory. */

    const chain = Chain.create();
    if (is_class(cls)) {
      chain.add(cls);
    }
    for (const factory of factories) {
      cls = factory(cls, config, ...factories);
      chain.add(cls);
    }
    cls.__chain__ = chain;
    /* NOTE
    - At this point, 'cls.__chain__' is intentionally an unprotected static 
      data property.
    - Completion and protection of 'cls.__chain__' takes place in 'register'.
    - While it is possible to subsequently access the prototype chain without 
      the use of 'Chain', its more efficient to exploit that 'compose' gets full
      access to prototype chain (as it builds it).
    */
    return cls;
  }

  /* Returns instance of registered class.
  - Uses the standard 'create' pattern.
  - Uses the 'create' instance lifecycle method. 
  NOTE
  - 'create' is the workhorse of the 'type' object. 
  */
  create(tag, ...args) {
    /* Get class from registry */
    const cls = this.get(tag, ...args);
    /* Create instance */

    let instance = Object.hasOwn(cls, "create")
      ? cls.create(...args)
      : new cls(...args);

    /* Call the 'created' lifecycle method */
    if (instance.created) {
      instance = instance.created() || instance;
      /* Prevent 'created' from being used onwards */
      delete instance.created;
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

  /* Adds meta data to, registers, and returns a class. */
  register(cls, tag) {
    /* Infer tag, if not explicitly provided */
    if (!tag) {
      tag = pascal_to_kebab(cls.name);
    }
    /* Handle static '__chain__' prop */
    if (cls.__chain__) {
      cls.__chain__.add(cls);
      cls.__chain__.freeze();
    } else {
      cls.__chain__ = Chain.create();
      cls.__chain__.add(cls);
      cls.__chain__.freeze();
    }
    /* Make static '__chain__' prop available as instance prop */
    add_meta(cls.prototype, "chain", cls.__chain__);
    /* Create __class__ instance prop for easy access to cls */
    add_meta(cls.prototype, "class", cls);
    /* Create __type__ instance prop as an alternative to 'instanceof' */
    add_meta(cls.prototype, "type", tag);
    /* Register cls */
    this.registry.add(tag, cls);
    /* Return cls, so that its home module can do additional work */
    return cls;
  }
}
