import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test Data.map */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");
  const { Effect } = await import("rollo/type/types/data/tools/effect");

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

  const effect = Effect.create(null, null, (change) => {}).register(state);
  data.$.foo = 42;
  console.log(`data:`, data.data);

  const foo = Value.create("foo");
  console.log(`current:`, foo.current);

  /*  */
  foo.effects.add((change) => {
    console.log(`current:`, change.current);
    console.log(`previous:`, change.previous);
  });

  foo.current = "FOO";

  foo.subscriptions.add(state, (change) => {
    let sum = 0
    for (const v of Object.values(change.current)) {
      sum += v
    }
    return sum

  })





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
