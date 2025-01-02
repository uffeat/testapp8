import "./bootstrap.scss";
import "./main.css";

//import "@/tests/_all"

/* Purpose: Demonstate and test List.$ */
await (async () => {
  const { List } = await import("rollo/type/types/list/list");

  const list = List();

  list.$[4.45];
  list.$.uffe;
  list.$.true;
  list.$.false;
  list.$.null;
  list.$[4.45];

  list.json();

  const actual = JSON.stringify(list.current)
  const expected = `[4.45,"uffe",true,false,null]`
  if (actual === expected) {
    console.log(`Success!`)
  } else {
    console.error(`Expected:`, expected, ` Actual:`, actual)
  }



  

  

  console.log("current:", list.current);
  ////console.log("current:", list.values);
})();

/* Run specific test from shift-T */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
