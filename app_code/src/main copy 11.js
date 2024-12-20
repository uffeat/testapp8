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

  class Source {
    get foo() {
      return "foo";
    }

    do_foo() {
      console.log("Doing foo...");
    }
  }

  const source = new Source();

  class Wrapper {
    constructor(source) {
      this.#source = source;
      return new Proxy(this, {
        get: (wrapper, key, receiver) => {
          if (key in wrapper) {
            return Reflect.get(wrapper, key, receiver);
          } else if (key in wrapper.source) {
            return wrapper.source[key];
          } else {
            console.warn("No go...");
          }
        },
        set: (wrapper, key, value, receiver) => {
          if (key in wrapper) {
            wrapper[key] = value;
          } else if (key in wrapper.source) {
            wrapper.source[key] = value;
          } else {
            console.warn("No go...");
          }

          return true;
        },
      });
    }

    get source() {
      return this.#source;
    }
    #source;

    get bar() {
      return "bar";
    }

    do_bar() {
      console.log("Doing bar...");
    }
  }


  const wrapper = new Wrapper(source)

  console.log(wrapper.foo)
  console.log(wrapper.bar)
  wrapper.do_foo()
  wrapper.do_bar()




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
