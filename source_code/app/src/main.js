import "./bootstrap.scss";
import "./main.css";
import { create } from "utils/component";
import { assets } from "utils/assets";


await (async () => {
  const {demo, my_template} = await assets.get('foo')
  demo(document.getElementById('root')).insertAdjacentHTML('beforeend', my_template)
})()

await (async () => {
  const htmlx = await import('htmlx/foo')
  console.dir(htmlx);
})()








create("button.btn.btn-primary", { parent: root }, "Yo World!");

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
