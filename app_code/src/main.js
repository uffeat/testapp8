import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";


import { close, offcanvas } from "rolloui/offcanvas";

create(null, {id: 'root', parent: document.body})

const result = await offcanvas(
  {
    title: "Hello world!",
    content: "The offcanvas function is awesome.",
    placement: 'top'
  },
  ["OK", true, "success"],
  ["Cancel", false, "danger"]
);
console.log("Modal result:", result);



if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
