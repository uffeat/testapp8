import "./bootstrap.scss";
import "./main.css";

await (async () => {
  class Foo {
    static create = () => {
      const instance = new Foo();
      return new Proxy(this, {
        apply: (target, thisArg, args) => {
          return instance.__call__.apply(instance, args);
        },
      });
    };

    __call__(...args) {
      console.log("Called with arguments:", args);
    }
  }

  const foo = Foo.create();
  foo(42);

  
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
