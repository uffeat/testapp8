import "./bootstrap.scss";
import "./main.css";

//import "@/tests/_data_all"

/* Purpose: Demonstate and test Data.computed. */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: 'foo',
    bar: 'bar',
    stuff: 42,
  });

  /* Set up effect to check batch-updates. */
  data.effects.add((change) => {
    const {data: {current}} = change
    console.log("current:", current);

    
  });

  
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
