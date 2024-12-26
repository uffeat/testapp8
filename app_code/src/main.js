import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Effect } = await import("rollo/type/types/effect/effect");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  const effect = Effect.create((data) => {
    console.log(`'previous' from effect:`, data.previous);
    console.log(`'current' from effect:`, data.current);
    //console.log(`'publisher' from effect:`, data.publisher);
    //console.log(`'session' from effect:`, data.session);
  }, 
  //"NUMBER"
);

  data.effects.add(effect);

  //data({ foo: "FOO", bar: "BAR" });
  data({ bar: 8, owner: 42 });
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
