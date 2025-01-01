import "./bootstrap.scss";
import "./main.css";



//import "@/tests/_data_all"

/* Purpose: Demonstate and test effect */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
    bar: "bar",
  });

  console.dir(data)

  

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
