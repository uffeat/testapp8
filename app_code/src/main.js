import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "FOO",
    bar: undefined,
  });

  //console.log("data:", data);

  const cls = type.get("data");

  //console.log("cls:", cls);

  /* Controller for prototype chain */
  class Chain {
    static create = (...args) => {
      return new Chain(...args);
    };
    constructor(owner) {
      if (owner) {
        this.owner = owner;
      }
    }

    /* Returns array of classes in prototype chain. 
    NOTE
    - Lazily created. */
    get chain() {
      if (!this.owner) {
        throw new Error(`'owner' not set.`);
      }
      if (!this.#chain) {
        this.#chain = [this.owner];
        let cls = Object.getPrototypeOf(this.owner);
        while (cls) {
          this.#chain.push(cls);
          cls = Object.getPrototypeOf(cls);
          if (cls === Object) {
            break;
          }
        }
        Object.freeze(this.#chain);
      }
      return this.#chain;
    }
    #chain;

    /* Returns set of defined properties in the entire prototype chain.
    NOTE
    - Lazily created.
    - Corresponds to a bound and prototype chain-wide version of 'Object.hasOwn'. 
    EXAMPLES
    - Check, if 'name' is a defined property:
        console.log('name is defined:', chain.defined.has('name'));
     */
    get defined() {
      if (!this.#defined) {
        this.#defined = new Set();
        for (const cls of this.chain) {
          for (const name of Object.getOwnPropertyNames(cls.prototype)) {
            this.#defined.add(name);
          }
        }
        Object.freeze(this.#defined);
      }
      return this.#defined;
    }
    #defined;

    /* Returns a set of class names.
    NOTE
    - Lazily created. 
    - Error, if a class does not have a name.
    - Error, if duplicate class names.
    EXAMPLES
    - Check, if a class with name 'Data' is in the prototype chain:
        console.log("A class with the name 'Data' is in the chain:", chain.names.has('Data'));
        
    */
    get names() {
      if (!this.#names) {
        const names = [];
        for (const cls of this.chain) {
          if (!cls.name) {
            throw new Error(`Class does not have a name.`);
          }
          if (names.includes(cls.name)) {
            throw new Error(`Duplicate class name: ${cls.name}.`);
          }
          names.push(cls.name);
        }
        this.#names = Object.freeze(new Set(names));
      }
      return this.#names;
    }
    #names;

    /* Returns owner class. */
    get owner() {
      return this.#owner;
    }
    /* Sets owner class.
    NOTE
    - 'write-once' property. */
    set owner(owner) {
      if (this.#owner) {
        throw new Error(`'owner' cannot be changed.`);
      }
      if (!this.#is_class(owner)) {
        throw new Error(`'owner' should be a class.`);
      }
      this.#owner = owner;
    }
    #owner;

    /* Returns an object with name-prototype items.
    NOTE
    - Lazily created. 
    - Error, if a prototype does not have a name.
    - Error, if duplicate prototype names.
    EXAMPLES
    - 
    */
    get prototypes() {
      if (!this.#prototypes) {
        this.#prototypes = {};
        const names = [];
        for (const cls of this.chain) {
          if (!cls.name) {
            throw new Error(`Class does not have a name.`);
          }
          if (names.includes(cls.name)) {
            throw new Error(`Duplicate class name: ${cls.name}.`);
          }
          names.push(cls.name);
          this.#prototypes[cls.name] = cls.prototype; ////
        }
        Object.freeze(this.#prototypes);
      }
      return this.#prototypes;
    }
    #prototypes;

    /* Returns number of prototypes in chain. */
    get size() {
      return this.chain.length;
    }

    /* Tests, if value is a class. */
    #is_class(value) {
      return (
        typeof value === "function" &&
        /^class\s/.test(Function.prototype.toString.call(value))
      );
    }
  }

  const chain = Chain.create(cls);

  console.log("chain:", chain.chain);
  console.log("defined:", chain.defined);
  console.log("clean is defined:", chain.defined.has("clean"));
  console.log("foo is defined:", chain.defined.has("foo"));
  console.log("names:", chain.names);
  console.log(
    "A class with the name 'Data' is in the chain:",
    chain.names.has("Data")
  );
  console.log("size:", chain.size);

  //console.log("prototypes:", chain.prototypes);

  chain.prototypes.data.clean.call(data);
  console.log("data:", data);

  //
  //
  //
})();

/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
