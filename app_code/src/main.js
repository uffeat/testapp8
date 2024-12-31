import "./bootstrap.scss";
import "./main.css";

//import "@/tests/_data_all"

/* Purpose: Demonstate and test ... */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Computed } = await import("rollo/type/types/computed/computed");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
  });

  const computed = Computed.create()

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
