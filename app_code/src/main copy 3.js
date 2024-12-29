import "./bootstrap.scss";
import "./main.css";

//import my_text from '/test.js?url'

function construct_module(path) {
  const url = new URL(path, import.meta.url).href;
  return new Function(`return import("${url}")`)();
}

const js_module = await construct_module(`public/test.js`);

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
