import "./bootstrap.scss";
import "./main.css";
import { create } from "utils/component";
import { assets } from "utils/assets";



const foo_html = await assets.get("foo.html");

const component = create('div', {parent: root}, foo_html)


//component.add_html(foo_html)





console.log(component); ////

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


function is_html(text) {
  if (!(typeof text === 'string')) {
    return false
  }
  text = text.trim()
  return /<([a-zA-Z]+)(\s[^>]*)?>.*<\/\1>|<([a-zA-Z]+)(\s[^>]*)?\/>/i.test(text);
}

console.log(is_html('<div></div><input/>'))