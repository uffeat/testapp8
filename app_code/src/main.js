import "./bootstrap.scss";
import "./main.css";

//import "@/tests/_data_all"

/* Purpose: Demonstate and Value.effects */
await (async () => {
  const { List } = await import("rollo/type/types/list/list");

  const list = List(1, 2, 3)

  list.effects.add((change) => {
    const {data: {added, removed}} = change
    console.log('change:', change)
    console.log('added:', added)
    console.log('removed:', removed)
  })

  list.add(4, 5)
  list.remove(3)
  

  console.log('current:', list.current)

  
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
