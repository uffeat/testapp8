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

  /* Base class for pseudo-extending unextendable source instances.
  NOTE
  - Strict key requirement, i.e., attempts to access keys that are not defined 
    in wrapper or source (or their prototype chains) throw an error. */
  class BaseWrapper {
    /* Returns proxy with first-wrapper-then-source resolution priority. */
    constructor(source) {
      this.#source = source;
      /* Create a wrapper this ref to enable use of private fileds in wrapper. */
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
        has: (target, key) => {
          /* Check wrapper (incl. prototype chain) */
          if (key in target) {
            return true;
          }
          /* Check source (incl. prototype chain)
          NOTE 
          - `key in target.source` only checks sources' own properties
          - `Reflect.has(target, key)` checks sources' prototype chain */
          return key in target.source || Reflect.has(target, key);
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
      return this.#bar;
    }
    set bar(bar) {
      this.#bar = bar;
    }
    #bar = "bar";

    /* Temporarily added for testing */
    do_bar() {
      console.log("Doing bar...");
      console.log("... and also...");
      this.source.do_foo();
    }
  }

  /* Testing */
  (() => {
    const wrapper = new BaseWrapper(
      Object.freeze(
        new (class Source extends class {
          get thing() {
            return "THING";
          }
        } {
          constructor() {
            super();
          }
          get foo() {
            return this.#foo;
          }
          set foo(foo) {
            this.#foo = foo;
          }
          #foo = "foo";

          /* For testing handling of symbols */
          get numbers() {
            return {
              *[Symbol.iterator]() {
                yield 1;
                yield 2;
                yield 3;
              },
            };
          }

          do_foo() {
            console.log("Doing foo...");
          }
        })()
      )
    );

    wrapper.bar = "BAR";
    wrapper.foo = "FOO";

    console.log("foo:", wrapper.foo);
    console.log("bar:", wrapper.bar);
    console.log("thing:", wrapper.thing);
    try {
      console.log(wrapper.stuff);
    } catch {
      console.log(`Correctly prevented getting an invalid key`);
    }
    try {
      wrapper.stuff = 42;
    } catch {
      console.log(`Correctly prevented setting an invalid key`);
    }

    wrapper.do_foo();
    wrapper.do_bar();
    console.log("toString:", wrapper.toString());
    console.log("valueOf:", wrapper.valueOf());
    console.log("numbers:", ...wrapper.numbers);

    console.log("Got foo:", "foo" in wrapper);
    console.log("Got bar:", "bar" in wrapper);
    console.log("Got thing:", "thing" in wrapper);
  })();
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
