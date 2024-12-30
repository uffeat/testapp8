import "./bootstrap.scss";
import "./main.css";


//import "@/tests/_data_all"

/* Purpose: Demonstate and test effects */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
  });

  /* Set up catch-all effect */
  const effect = data.effects.add(({ current }) => {
    console.log(`current:`, current);
  });

  data.$.foo = "FOO";

  



  

  //effect.disabled = true;

  

  
  data.$.bar = "BAR";
  data.$.stuff = 8;

  //console.log(`data.data:`, data.data);
  
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