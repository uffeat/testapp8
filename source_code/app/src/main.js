import "./bootstrap.scss";
import "./main.css";
import { create } from "utils/component";
import { asset } from "@/utils/asset";




const htmlx = asset.get('foo.htmlx')

async function import_js(path) {
  return await new Function(`return import("./app/src/${path}.js")`)();
}

//const {bar} = await import_js('tests/bar')





create("button.btn.btn-primary", { parent: root }, "Hello W!");

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
