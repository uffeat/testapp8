import "./bootstrap.scss";
import "./main.css";

import html from '@/test/test.html?raw'
import url from '@/test/test.js?url'

console.log(html)

function construct_module(url) {
  //const url = new URL(path, import.meta.url).href;
  return new Function(`return import("${url}")`)();
}

//const js_module = await construct_module(`public/test.js`);
const js_module = await construct_module(url);
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
