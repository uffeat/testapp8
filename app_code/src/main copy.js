import "./bootstrap.scss";
import "./main.css";



//import "@/tests/_data_all"

/* Purpose: Demonstate and test ... */
await (async () => {
  const { type } = await import("rollo/type/type/type");
  const { Data } = await import("rollo/type/types/data/data");
  //const { Computed } = await import("rollo/type/types/computed/computed");
  await import("rollo/type/types/computed/computed");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
  });

  //const computed = Computed.create()
  const computed = type.create('computed');

  console.dir(computed)

  
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
