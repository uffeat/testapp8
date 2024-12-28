import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test Data.$ */
await (async () => {
 
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 7,
    __name__: "uffe",
  });

  /*  */
  data.effects.add((change) => {
    console.log(`current:`, change.current);
  });

  const state = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  
  data.$.foo = 42;
 

  const foo = Value.create("foo");
  
  

  foo.current = "FOO";

  

  
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
