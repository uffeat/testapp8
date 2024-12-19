/* Utility for authoring instantiating classes. 
Notable features:
- Factory-based simulated multiple inheritance.
- Object registry inspired by web components.
- Unified instantiation from registered classes with support for:
  - Custom life-cycle methods.
  - Standard methods called in a standard order

*/
export const type = new (class Type {
  /* Returns registry controller. */
  get registry() {
    return this.#registry;
  }
  #registry = new (class Registry {
    #registry = {};
    /* Registers and returns class. */
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
    /* Returns registered class. */
    get = (tag) => {
      return this.#registry[tag];
    };
  })();

  /* Builds, registers and returns class from base, config and factories.
  Simulates multiple inheritance. */
  author(tag, cls, config, ...factories) {
    /* NOTE
    - 'factories' is passed into each factory, so that the individual factory 
      is aware of it's siblings. Factories can, but should generally not, 
      mutate 'factories'. 
    - 'config' is passed into each factory. 'config' can be an object that 
      instructs factories. Factories can, but should generally not, mutate 
      'config'. */

    const chain = [cls];
    const names = [];

    //factories.push((parent) => class Type extends parent {}, (parent) => class Composite extends parent {});

    /* Build composite class */
    for (const factory of factories) {
      cls = factory(cls, config, ...factories);
      /* Check name */
      if (cls.name) {
        if (names.includes(cls.name)) {
          console.warn(`Duplicate factory class name: ${cls.name}`);
        }
        names.push(cls.name);
      } else {
        console.warn(`Unnamed factory class:`, cls);
      }

      /* Handle chain */
      
      chain.push(cls);
    }

    /* Wrap the built cls in a common 'Type' class.
      - The 'Type' class becomes the '__class__' value. 
        This signals that the class is a composite class created by 'type'.
        Otherwise, '__class__' would be the last factory class, which would be 
        misleading.
      - By injecting an additional prototype, any console representation of an 
        instance will refer to the last factory class; otherwise, it would be 
        the second-last factory class (confusing and inconsistent with the 
        built chain). */
    cls = class Type extends cls {};

    /* Give cls the ability to mutate its prototype by directly assigning 
    members from other classes. 
    NOTE
    - In addition to usage below, this can be useful for modifying a composite 
      class after it has been built from factories, e.g., when:
      - Something must be done that requires guarantee that all factories have benn 
        implemented.
      - The class needs to be modified with objects outside its factories.
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
    const __chain__ = Object.freeze(chain);
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
  }

  /* Creates and configures instance of class. 
  Returns function for further instance setup. */
  config(tag, config) {
    /* Create instance */
    let instance = this.create(tag);
    /* Call the 'constructed_callback' lifecycle method */
    if (instance.constructed_callback) {
      const result = element.constructed_callback(config);
      /* Allow truthy result to replace instance */
      if (result) {
        instance = result;
      }
      /* Prevent 'constructed_callback' from being used onwards */
      instance.constructed_callback = undefined;
    }
    return (update, ...hooks) => this.create(instance, update, ...hooks);
  }

  /* Returns instance of class. */
  create(tag, update, ...hooks) {
    let instance;
    if (typeof tag === "string") {
      /* Get class from registry */
      const cls = this.registry.get(tag);
      if (!cls) {
        throw new Error(`Type '${tag}' not registered.`);
      }
      /* Create instance */
      instance = new cls();
    } else {
      instance = tag;
    }
    /* Call the 'update' standard method */
    update && instance.update && instance.update(update);
    /* Call the 'hooks' standard method */
    instance.hooks && instance.hooks(...hooks);
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
})();
