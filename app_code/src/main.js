import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type, assign } = await import("rollo/type/type");

  await import("rollo/type/types/data/data");




  const data = type.create("data", {
    foo: "FOO",
    nothing: undefined,
  });

  /*
  console.log('data:', data)
  console.log('chain:', data.__chain__)
  console.log('class:', data.__class__)
  console.log('type:', data.__type__)
  console.log('data proto:', data.__chain__.proto.data)
  data.__chain__.proto.data.clean.call(data)
  console.log('data:', data)
  */



  /* Base class for pseudo-extending unextendable sources.
  NOTE
  - Strict key requirement, i.e., attempts to access keys that are not defined 
    in wrapper or source (or their prototype chains) throw an error. */
  class BaseWrapper {
    /* Returns proxy that gives first priority to wrapper instance and 
    second priority to wrapped source. */
    constructor(source) {
      this.#source = source;

      const wrapper = this;

      return new Proxy(this, {
        get: (target, key) => {
          /* Handle wrapper members */
          if (key in target) {
            return wrapper[key];
          }
          /* Handle source members and symbols */
          if (key in target.source || typeof key === "symbol") {
            const value = Reflect.get(target.source, key);
            /* Bind any function value to source */
            return typeof value === "function"
              ? value.bind(target.source)
              : value;
          }
          /* Handle native methods */
          const value = Reflect.get(target, key);
          if (value !== undefined) {
            return value;
          }
          throw new Error(`Invalid key: ${String(key)}`);
        },
        set: (target, key, value) => {
          /* Handle wrapper members */
          if (key in target) {
            return Reflect.set(target, key, value);
          }
          /* Handle source members */
          if (key in target.source) {
            return Reflect.set(target.source, key, value);
          }
          throw new Error(`Invalid key: ${String(key)}`);
        },
      });
    }

    /* Returns wrapped source. */
    get source() {
      return this.#source;
    }
    #source;

    /* Temporarily added for testing */
    get bar() {
      return this.#bar
    }
    set bar(bar) {
      this.#bar = bar
    }
    #bar = 'bar'

    /* Temporarily added for testing */
    do_bar() {
      console.log("Doing bar...");
      console.log("... and also...");
      this.source.do_foo();
    }
  }

  /* Testing */
  
  /* Create an unextendable source */
  const source = Object.freeze(new (class Source {
    get foo() {
      return this.#foo
    }
    set foo(foo) {
      this.#foo = foo
    }
    #foo = 'foo'

    do_foo() {
      console.log("Doing foo...");
    }
  })())

  const wrapper = new BaseWrapper(source);

  wrapper.bar = 'BAR'
  wrapper.foo = 'FOO'

  console.log('foo:', wrapper.foo);
  console.log('bar:', wrapper.bar);
  try {
    console.log(wrapper.stuff)
  } catch {
    console.log(`Correctly prevented getting an invalid key`)
  }
  try {
    wrapper.stuff = 42
  } catch {
    console.log(`Correctly prevented setting an invalid key`)
  }


  
  wrapper.do_foo();
  wrapper.do_bar();
  console.log(wrapper.toString());


  const iterable = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
      yield 3;
    },
  };

  const wrapper_1 = new BaseWrapper(iterable);
  console.log([...wrapper_1]);







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
