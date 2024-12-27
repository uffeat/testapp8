import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  if (null instanceof Object) {
    console.log('Got it')
  }

  (() => {
    const data = Data.create({
      foo: 4,
      bar: "bar",
      stuff: 42,
      condition: ([k, v]) => typeof v === "number",
    });

    data.effects.add(({current, previous}) => {

      console.log(`'previous' from effect:`, previous.current);
      console.log(`'current' from effect:`, current.current);
    });

    data({ bar: 8, stuff: "stuff" });

    data.name = 'uffe'

    
    
  })();
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
