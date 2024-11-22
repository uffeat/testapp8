import "./bootstrap.scss";
import "./main.css";
import { component, create } from "rollo/component";

//const Component = component.author(HTMLElement)

const Component = component.base(HTMLElement)

console.log(Component)



create(null, {id: 'root', parent: document.body})

import { modal } from "rolloui/modal";

const result = await modal(
  {
    title: "Hello world!",
    content: "The modal function is awesome.",
    size: "lg",
    style: "primary",
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
