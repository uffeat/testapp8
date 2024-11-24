import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO email and number

create("", { id: "root", parent: document.body });



if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
