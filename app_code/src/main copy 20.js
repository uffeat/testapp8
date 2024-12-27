import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test effects */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

 

  data.effects.add(
    ({ current }) => {
      console.log(current);

      if (!("foo" in current)) {
        console.error(`No 'foo'!`);
      }
    },
    ({ current }) => "foo" in current
  );

  data.foo = "FOO";
  data.bar = "BAR";
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
