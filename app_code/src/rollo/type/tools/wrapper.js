/* Base class for pseudo-extending unextendable source instances.
  NOTE
  - Strict key requirement, i.e., attempts to access keys that are not defined 
    in wrapper or source (or their prototype chains) throw an error. */
export class Wrapper {
  /* Returns proxy with first-wrapper-then-source resolution priority. 
  NOTE
  - 'create' works as a pseudo-constructor and should be called from any child 
    class' constructor, like so:
      constructor(source) {
        super()
        return this.create(this, source)
      }
    Necessary, to allow use of private fields in any child class. */
  create(wrapper, source) {
    this.#source = source;
    /* Create a this ref to enable use of private fileds. */
    wrapper = wrapper || this;

    return new Proxy(this, {
      get: (target, key) => {
        /* Handle wrapper members */
        if (key in wrapper) {
          return wrapper[key];
        }
        /* Handle source members and symbols */
        if (key in source || typeof key === "symbol") {
          const value = Reflect.get(source, key);
          /* Bind any function value to source */
          return typeof value === "function" ? value.bind(source) : value;
        }
        /* Handle native methods */
        const value = Reflect.get(wrapper, key);
        if (value !== undefined) {
          return value;
        }
        throw new Error(`Invalid key: ${String(key)}`);
      },
      set: (target, key, value) => {
        /* Handle wrapper members */
        if (key in wrapper) {
          return Reflect.set(wrapper, key, value);
        }
        /* Handle source members */
        if (key in source) {
          return Reflect.set(source, key, value);
        }
        throw new Error(`Invalid key: ${String(key)}`);
      },
      has: (target, key) => {
        /* Check wrapper (incl. prototype chain) */
        if (key in wrapper) {
          return true;
        }
        /* Check source (incl. prototype chain)
          NOTE 
          - `key in target.source` only checks sources' own properties
          - `Reflect.has(target, key)` checks sources' prototype chain */
        return key in source || Reflect.has(source, key);
      },
    });
  }

  /* Returns wrapped source. */
  get source() {
    return this.#source;
  }
  #source;
}

/* Creates and returns a Wrapper instance from wrapping class and source. 
  NOTE
  - Proxy resolution priority: First wrapper, then source.
  - To enable reference to 'source' from inside 'cls', 'source' is passed 
    into the 'cls' constructor. 
  - 'wrap' is a lean alterative to using Wrapper and
    - does NOT require 'cls' to extend from Wrapper
    - does NOT require 'cls' to have a constructor 
      (unless it needs access to source; which could be established in other ways)
    - does NOT require 'cls' to be instantiated */
export function wrap(cls, source) {
  return new Wrapper().create(new cls(source), source);
}
