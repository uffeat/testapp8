import { Macro } from "rollo/type/tools/macro";
import { Registry } from "rollo/type/tools/registry";
import { add_meta } from "rollo/type/tools/add_meta";
import { is_class } from "rollo/type/tools/is_class";

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

    const classes = Classes.create();
    if (is_class(cls)) {
      classes.add(cls);
    }
    for (const factory of factories) {
      cls = factory(cls, config, ...factories);
      classes.add(cls);
    }
    cls.__classes__ = classes;
    /* NOTE
    - At this point, 'cls.__classes__' is intentionally an unprotected static 
      data property.
    - Completion and protection of 'cls.__classes__' takes place in 'register'.
    - While it is possible to subsequently access the prototype chain without 
      the use of 'Classes', its more efficient to exploit that 'compose' get full
      access to prototype chain (s it builds it).
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
    let instance = cls.create ? cls.create(...args) : new cls(...args);
    /* Call the 'create' lifecycle method */
    if (instance.create) {
      instance = instance.create() || instance;
      /* Prevent 'create' from being used onwards */
      delete instance.create;
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

  /* Adds meta data to, registers, and returns a class. 
  NOTE
  - Typical use pattern: In a dedicated JS module,
    - Create a composed class with 'compose'
    - Create a registation class that extends the composed class
    - Typically, give the registation class a static 'create' method for 
      flexibility.
    - Register the registation class with 'register'.
    - Optionally, expose the result of 'register' for export to provide a 
      syntactical alternative to 'type.create'
  - Use 'registry.add' instead to register without adding meta data. 
  */
  register(tag, cls) {
    if (cls.__classes__) {
      cls.__classes__.add(cls);
      cls.__classes__.freeze();
    } else {
      cls.__classes__ = Classes.create();
      cls.__classes__.add(cls);
      cls.__classes__.freeze();
    }
    add_meta(cls.prototype, "classes", cls.__classes__);
    add_meta(cls.prototype, "class", cls);
    add_meta(cls.prototype, "type", tag);
    this.registry.add(tag, cls);
    return cls;
  }
}

/* Composition class for providing access to the prototype chain. */
class Classes {
  static create = () => new Classes();

  /* Returns array of classes in prototype chain. */
  get classes() {
    return this.#classes;
  }
  #classes = [];

  /* Returns set of defined properties in the entire prototype chain.
  NOTE
  - Corresponds to a bound and prototype chain-wide version of 'Object.hasOwn'. 
  EXAMPLES
  - Check, if 'name' is a defined property:
      console.log('name is defined:', classes.defined.has('name')); 
  */
  get defined() {
    return this.#defined;
  }
  #defined = new Set();

  /* Once 'freeze' has been called, returns a set of class names for classes the
  in prototype chain.
  EXAMPLES
  - Check, if a class with name 'Data' is in the prototype chain:
      console.log("A class with the name 'Data' is in the chain:", classes.names.has('Data'));
  */
  get names() {
    return this.#names;
  }
  #names = [];

  /* Returns an object with name-prototype items for classes in the prototype chain.
  EXAMPLES
  - Get and use the 'clean' method from the 'clean' class in the prototype chain:
      classes.prototypes.clean.clean.call(data);
  */
  get prototypes() {
    return this.#prototypes;
  }
  #prototypes = {};

  /* Returns number of classes in prototype chain. */
  get size() {
    return this.classes.length;
  }

  /* Registers class. */
  add(cls) {
    /* Check class */
    if (!is_class(cls)) {
      throw new TypeError(`Expected a class. Got: ${String(cls)}`);
    }
    if (!cls.name) {
      throw new Error(`Class does not have a name.`);
    }
    /* Build classes */
    this.#classes.unshift(cls);
    /* Build defined */
    for (const name of Object.getOwnPropertyNames(cls.prototype)) {
      this.#defined.add(name);
    }
    /* Build names */
    if (this.#names.includes(cls.name)) {
      throw new Error(`Duplicate class name: ${cls.name}.`);
    }
    this.#names.unshift(cls.name);
    /* Build prototypes */
    this.#prototypes[cls.name] = cls.prototype;
  }

  /* Freezes accessor properties. */
  freeze() {
    if (this.#frozen) {
      throw new Error(`Already frozen.`);
    }
    [this.#classes, this.#defined, this.#prototypes].forEach((object) =>
      Object.freeze(object)
    );
    /* Convert 'names' to set (to enable the faster 'has', rather than 'includes') 
    and freeze */
    this.#names = Object.freeze(new Set(this.#names));
    this.#frozen = true;
  }
  #frozen;
}
