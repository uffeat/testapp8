import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");

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

  /* Base class for psudo-extending unextendable sources. */
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
          /* Handle standard source members */
          if (key in target.source) {
            const value = target.source[key];
            /* Bind function values to wrapper */
            return typeof value === "function"
              ? value.bind(target.source)
              : value;
          }
          /* Handle common symbols, e.g., Symbol.iterator or Symbol.toStringTag */
          if (typeof key === "symbol") {
            return Reflect.get(target.source, key);
          }

          /* Handle common native methods */
          if (["toString", "valueOf"].includes(key)) {
            return Reflect.get(target.source, key)
          }

          throw new Error(`Invalid key: ${key}`);
        },
        set: (target, key, value) => {
          if (key in target) {
            return Reflect.set(target, key, value);
          }

          if (key in target.source) {
            return Reflect.set(target.source, key, value);
          }
          throw new Error(`Invalid key: ${key}`);
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
      return "bar";
    }

    /* Temporarily added for testing */
    do_bar() {
      console.log("Doing bar...");
      console.log("... and also...");
      this.source.do_foo();
    }
  }

  /* Testing */
  class AsIfUnextendable {
    get foo() {
      return "foo";
    }

    do_foo() {
      console.log("Doing foo...");
    }
  }

  const wrapper = new BaseWrapper(new AsIfUnextendable());
  console.log(wrapper.foo);
  console.log(wrapper.bar);
  wrapper.do_foo();
  wrapper.do_bar();
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
