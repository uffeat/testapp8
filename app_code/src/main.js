import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");

  type.macros.add(function foo(tag, ...args) {
    if (tag !== "foo") return;

    class Foo {
      constructor() {
        console.log(`'Foo' instance created.`);
      }
    }

    this.register("foo", Foo);
    this.macros.remove(foo);
    return true;
  });

  type.create("foo");
  console.log(`Macros registered: ${type.macros.size}`) // Correctly shows 0

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
