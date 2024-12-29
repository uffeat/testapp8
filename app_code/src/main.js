import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test Data.$ */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
  });

  /* Set up effect to watch changes */
  data.effects.add((change) => {
    console.log(`current:`, change.current);
  });

  data.$.foo = 42;
  data.$.foo = 42;
  data.$.foo = undefined;

  console.log("data.data:", data.data);
})();


if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}