import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    thing: true,
    stuff: 42,
    name: "uffe",
  });

  /* BUG
   */
  //data({ foo: "FOO", bar: "BAR" });

  //console.log("data:", data);

  class Foo extends Function {
    constructor() {
      super();
      const instance = this;

      return new Proxy(instance, {
        apply(target, thisArg, args) {
          return instance.__call__(...args);
        },
      });
    }
    __call__(...args) {
      console.log("Called with arguments:", args);
    }
  }

  const foo = new Foo();
  foo(1, 2, 3);



})();

/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`@/tests/${path}.js`);
    }
  });
}
