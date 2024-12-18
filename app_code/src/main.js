import "./bootstrap.scss";
import "./main.css";

import { type } from "rollo/type/type";
import "rollo/type/types/data/data";

const data = type.create('data')

console.log(data.tag)




/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
