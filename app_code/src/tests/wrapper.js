// wrapper

await (async () => {
  const { Wrapper, wrap } = await import("rollo/type/tools/wrapper");

  const source = Object.freeze(
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
            yield 0;
            yield 1;
            yield 2;
          },
        };
      }

      do_foo() {
        return "foo";
      }
    })()
  );

  /* Test wrapper */
  function test(wrapper) {
    /* Test private fields and if wrapper properties are set correctly */
    wrapper.bar = "BAR";
    if (wrapper.bar !== "BAR") {
      throw new Error(`Expected: 'BAR'. Got: ${wrapper.bar}`);
    }
    /* Test private fields and if source own properties are set correctly */
    wrapper.foo = "FOO";
    if (wrapper.foo !== "FOO") {
      throw new Error(`Expected: 'FOO'. Got: ${wrapper.foo}`);
    }
    /* Test access to source chain properties */
    if (wrapper.thing !== "THING") {
      throw new Error(`Expected: 'THING'. Got: ${wrapper.thing}`);
    }
    /* Test, if error is thrown, when attempting to get invalid key */
    (() => {
      let error;
      try {
        wrapper.stuff;
      } catch {
        error = true;
      }
      if (!error) {
        throw new Error(`Getting an invalid key did not throw an error.`);
      }
    })();
    /* Test, if error is thrown, when attempting to set invalid key */
    (() => {
      let error;
      try {
        wrapper.stuff = 42;
      } catch {
        error = true;
      }
      if (!error) {
        throw new Error(`Setting an invalid key did not throw an error.`);
      }
    })();
    /* Test source method */
    (() => {
      const result = wrapper.do_foo();
      if (result !== "foo") {
        throw new Error(`Expected: 'foo'. Got: ${result}`);
      }
    })();
    /* Test wrapper method and wrapper's access to source */
    (() => {
      const result = wrapper.do_bar();
      if (result !== "foobar") {
        throw new Error(`Expected: 'foobar'. Got: ${result}`);
      }
    })();
    /* Test that native methods can be called - watch the console */
    console.log("toString:", wrapper.toString());
    console.log("valueOf:", wrapper.valueOf());
    /* Test symbols */
    for (const [index, number] of [...wrapper.numbers].entries()) {
      if (index !== number) {
        throw new Error(`Expected:  ${index}. Got: ${number}`);
      }
    }
    /* Test 'in' operator for source */
    if (!("foo" in wrapper)) {
      throw new Error(`'foo' was incorrectly determined NOT to be in wrapper.`);
    }
    /* Test 'in' operator for source chain */
    if (!("thing" in wrapper)) {
      throw new Error(
        `'thing' was incorrectly determined NOT to be in wrapper.`
      );
    }
    /* Test 'in' operator for wrapper */
    if (!("bar" in wrapper)) {
      throw new Error(`'bar' was incorrectly determined NOT to be in wrapper.`);
    }
  }

  /* Test Wrapper */
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
        return `${this.source.do_foo()}${"bar"}`;
      }
    }

    test(new MyWrapper(source));
  })();

  /* Test wrap */
  (() => {
    class MyWrapper {
      constructor(source) {
        this.source = source;
      }
      get bar() {
        return this.#bar;
      }
      set bar(bar) {
        this.#bar = bar;
      }
      #bar = "bar";

      do_bar() {
        return `${this.source.do_foo()}${"bar"}`;
      }
    }

    test(wrap(MyWrapper, source));
  })();
})();
