import { component } from "@/rollo/component/component.js";

//
//
console.log("Loading Brython...");


const iframe = component.iframe({
  parent: document.head,
  src:  `${import.meta.env.BASE_URL}libs/brython/brython.html`,
});
const { promise, resolve } = Promise.withResolvers();
iframe.onload = (event) => resolve();
await promise;
const iframe_window = iframe.contentWindow
const iframe_document = iframe.contentDocument


const __BRYTHON__ = iframe_window.__BRYTHON__
//console.dir(__BRYTHON__)
//console.log(__BRYTHON__.python_to_js)


const brython = {
  run: (text) => {
    return iframe_window.run_python(text);
  },
};

await brython.run("print('Hello from Brython')")




//
//

/* NOTE Do NOT await import! */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}
