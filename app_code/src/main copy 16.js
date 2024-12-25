import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    
  });

  data.on_change = ({ current, previous, owner }) => {
    console.log(`'previous' from on_change:`, previous);
    console.log(`'current' from on_change:`, current);
  };

  /* Change single data item in different ways */
  data.foo = "changed foo";
  data({ foo: "changed foo again" });
  /* Batch-change multipe data items */
  data({ foo: "FOO", bar: "BAR" });

  /* Delete single data item in different ways */
  data.foo = undefined
  data({ bar: undefined });

  
  console.log("data.data:", data.data);
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
