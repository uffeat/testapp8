import { Chain } from "rollo/type/tools/chain";
import { Macro } from "rollo/type/tools/macro";
import { Registry } from "rollo/type/tools/registry";
import { add_meta } from "rollo/type/tools/add_meta";

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
      This can be useful during chain  inspection to signal that a given class 
      was injected into the chain by a factory. */

    /* TODO
    - meta abstration
    */
    /* Init meta */
    const classes = [];
    const names = [];
    const defined = new Set();
    const prototypes = {};

    const build_meta = (cls) => {
      /* Build chain */
      classes.push(cls);
      /* Build names */
      if (!cls.name) {
        throw new Error(`Class does not have a name.`);
      }
      if (names.includes(cls.name)) {
        throw new Error(`Duplicate class name: ${cls.name}.`);
      }
      names.push(cls.name);
      /* Build defined */
      for (const name of Object.getOwnPropertyNames(cls.prototype)) {
        defined.add(name);
      }
      /* Build prototypes */
      prototypes[cls.name] = cls.prototype;
    };

    if (is_class(cls)) {
      build_meta(cls);
    }

    for (const factory of factories) {
      cls = factory(cls, config, ...factories);
      build_meta(cls);
    }
    cls.__classes__ = classes.reverse();
    cls.__names__ = names.reverse();
    cls.__defined__ = defined;
    cls.__prototypes__ = prototypes;

    //console.log("__chain__:", cls.__chain__);

    return cls;
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

  /* Adds meta data to, registers and returns a class. 
  NOTE
  - Use 'registry.add' instead to register without adding meta data. 
  */
  register(tag, cls) {
    if (!is_class(cls)) {
      throw new TypeError(`Expected a class. Got: ${String(cls)}`);
    }
    if (!cls.name) {
      throw new Error(`Class does not have a name.`);
    }

    if (cls.__classes__) {
      cls.__classes__ = [cls, ...cls.__classes__];

      console.log("__classes__:", cls.__classes__);
    } else {
    }

    add_meta(cls.prototype, "class", cls);
    add_meta(cls.prototype, "type", tag);
    add_meta(cls.prototype, "chain", Chain.create(cls));
    this.registry.add(tag, cls);
    return cls;
  }
}

class Classes {
  static create = () => new Classes();

  get classes() {
    return this.#classes;
  }
  #classes = [];

  get defined() {
    return this.#defined;
  }
  #defined = new Set();

  get names() {
    return this.#names;
  }
  #names = [];

  get prototypes() {
    return this.#prototypes;
  }
  #prototypes = {};

  add(cls) {
    /* Check class */
    if (!is_class(cls)) {
      throw new TypeError(`Expected a class. Got: ${String(cls)}`);
    }
    if (!cls.name) {
      throw new Error(`Class does not have a name.`);
    }
    /* Build classes */
    this.#classes.push(cls);
    /* Build defined */
    for (const name of Object.getOwnPropertyNames(cls.prototype)) {
      this.#defined.add(name);
    }
    /* Build names */
    if (this.#names.includes(cls.name)) {
      throw new Error(`Duplicate class name: ${cls.name}.`);
    }
    this.#names.push(cls.name);
    /* Build prototypes */
    this.#prototypes[cls.name] = cls.prototype;
  }

  freeze() {
    if (this.#frozen) {
      throw new Error(`Already frozen.`);
    }
    [this.#classes, this.#defined, this.#names, this.#prototypes].forEach(
      (object) => Object.freeze(object)
    );
    this.#frozen = true;
  }
  #frozen;
}

class Meta {
  static create = () => new Meta();

  get class() {
    return this.#class;
  }
  set class(cls) {
    this.#class = cls;
  }
  #class;

  get classes() {
    return this.#classes;
  }
  #classes = [];

  get defined() {
    return this.#defined;
  }
  #defined = new Set();

  get names() {
    return this.#names;
  }
  #names = [];

  get prototypes() {
    return this.#prototypes;
  }
  #prototypes = {};

  get type() {
    return this.#type;
  }
  set type(type) {
    this.#type = type;
  }
  #type;

  add(cls) {
    /* Check class */
    if (!is_class(cls)) {
      throw new TypeError(`Expected a class. Got: ${String(cls)}`);
    }
    if (!cls.name) {
      throw new Error(`Class does not have a name.`);
    }
    /* Build classes */
    this.#classes.push(cls);
    /* Build defined */
    for (const name of Object.getOwnPropertyNames(cls.prototype)) {
      this.#defined.add(name);
    }
    /* Build names */
    if (this.#names.includes(cls.name)) {
      throw new Error(`Duplicate class name: ${cls.name}.`);
    }
    this.#names.push(cls.name);
    /* Build prototypes */
    this.#prototypes[cls.name] = cls.prototype;
  }

  create_chain() {
    //TODO
  }
}

/* Tests, if value is a class. */
function is_class(value) {
  return (
    typeof value === "function" &&
    /^class\s/.test(Function.prototype.toString.call(value))
  );
}
