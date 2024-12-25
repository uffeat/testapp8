import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  /* Create data object */
  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });
  /* Set up catch-all effect */
  data.effects.add(({ current, previous, owner, session }) => {
    console.log(`'previous' from effect:`, previous);
    console.log(`'current' from effect:`, current);
    console.log(`'session' from effect:`, session);
  });
  /* Change single data item in different ways */
  data.foo = "changed foo";
  data({ foo: "changed foo again" });
  /* Batch-change multipe data items */
  data({ foo: "FOO", bar: "BAR" });
  /* Delete single data item in different ways */
  data.foo = undefined;
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
