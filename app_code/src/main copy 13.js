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

  

  const { Wrapper, wrap } = await import("rollo/type/tools/wrapper");

  /* Testing */
  (() => {
    class MyWrapper extends Wrapper {
      constructor(source) {
        super();
        return this.create(this, source);
      }

      get bar() {
        return this.#bar;
      }
      set bar(bar) {
        this.#bar = bar;
      }
      #bar = "bar";

      do_bar() {
        console.log("Doing bar...");
        console.log("... and also...");
        this.source.do_foo();
      }
    }

    const wrapper = new MyWrapper(
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

  /* Testing */
  (() => {
    class MyWrapper {
      constructor(source) {
        this.source = source

      }
      get bar() {
        return this.#bar;
      }
      set bar(bar) {
        this.#bar = bar;
      }
      #bar = "bar";

      do_bar() {
        console.log("Doing bar...");
        console.log("... and also...");
        this.source.do_foo();
      }
    }

    const wrapper = wrap(MyWrapper, Object.freeze(
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
    ))

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
