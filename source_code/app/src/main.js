import "./bootstrap.scss";
import "./main.css";
import { create } from "@/utils/component";
import { import_htmlx } from "./utils/import_htmlx";


const htmlx = import_htmlx('foo')



create("button.btn.btn-primary", { parent: root }, "Hello W!");



if (import.meta.env.DEV) {
  let path = ''
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}


