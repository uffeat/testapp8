import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test effects */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create();

  /* Set up catch-all effect */
  data.effects.add(({ current }) => {
    console.log(`current from catch-all:`, current.current);
  });

  /* Set up effect that requires 'foo' in current */
  data.effects.add(({ current }) => {
    console.log(`current:`, current.current);
    if (!("foo" in current)) {
      console.error(`No 'foo'!`);
    }
  }, "foo");

  /* Set up effect that requires 'bar' OR 'foo' in current */
  data.effects.add(({ current }) => {
    console.log(`current:`, current.current);
    if (!("foo" in current) && !("bar" in current)) {
      console.error(`Neither 'foo', nor 'bar!`);
    }
  }, ['bar', "foo"]);

  /* Set up effect that requires foo=42 in current */
  data.effects.add(({ current }) => {
    console.log(`current:`, current.current);
    if (current.foo !== 42) {
      console.error(`'foo' not 42!`);
    }
  }, {foo: 42});

  data.foo = "FOO";
  data.bar = "BAR";
  data.stuff = 8;
  data.foo = 42

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
