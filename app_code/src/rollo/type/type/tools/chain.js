import { is_class } from "@/rollo/tools/type/is_class";


/* Composition class for providing access to the prototype chain. */
export class Chain {
  static create = () => new Chain();

  /* Returns array of classes in prototype chain. */
  get classes() {
    return this.#classes;
  }
  #classes = [];

  /* Returns a set of defined properties in the entire prototype chain.
  NOTE
  - Corresponds to a bound and prototype chain-wide version of 'Object.hasOwn'. 
  EXAMPLES
  - Check, if 'name' is a defined property:
      console.log('name is defined:', instance.__chain__.defined.has('name')); 
  */
  get defined() {
    return this.#defined;
  }
  #defined = new Set();

  /* Once 'freeze' has been called, returns a set of class names for classes the
  in prototype chain.
  EXAMPLES
  - Check, if a class with name 'Data' is in the prototype chain:
      console.log("A class with the name 'Data' is in the chain:", instance.__chain__.names.has('Data'));
  */
  get names() {
    return this.#names;
  }
  #names = [];

  /* Returns an object with name-prototype items for classes in the prototype chain.
  EXAMPLES
  - Get and use the 'clean' method from the 'clean' class in the prototype chain:
      instance.__chain__.prototypes.clean.clean.call(data);
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
