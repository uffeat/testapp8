import "./bootstrap.scss";
import "./main.css";

function construct_module(url) {
 
  //const url = new URL(`public/test.js`, import.meta.url).href;
  return new Function(`return import("${url}")`)();
}




const js_module = await construct_module(new URL(`public/test.js`, import.meta.url).href);

const { test } = js_module;
test();

/* Enable tests */
/*
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
  */
