import "./bootstrap.scss";
import "./main.css";
import { create } from "utils/component";
import { assets } from "utils/assets";


await (async () => {
  const htmlx = await assets.get('foo')

  console.dir(htmlx);
  
  const {foo} = await assets.get('foo.js')
  console.log(foo)
  
  const foo_html = await assets.get('foo.html')
  console.log(foo_html)
  
  const foo_css = await assets.get('foo.css')
  console.log(foo_css)
})()





create("button.btn.btn-primary", { parent: root }, "Hello World!");

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
