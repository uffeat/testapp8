import "./bootstrap.scss";
import "./main.css";

//import vite from '/vite.svg'




const button = document.createElement('button')
button.classList.add('btn', 'btn-primary')
button.textContent = 'Hello'
////button.append(vite)
document.body.append(button)

//import "@/tests/_all"

/* Purpose: Demonstate and test List.clear */
await (async () => {
  const { List } = await import("rollo/type/types/list/list");

  const list = List(1, 2, 3);

  list.clear();

  /* Prepare test */
  let actual = "";

  /* Verify */
  (() => {
    const expected = "42";
    const message = `Expected ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      //console.error(message);
    }
  })();

  ////console.log("current:", list.current);
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
