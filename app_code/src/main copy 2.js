import { component } from "@/rollo/component/component.js";

//
//
console.log("Loading Brython...");
const iframe = component.iframe({
  parent: document.head,
  src: `${import.meta.env.BASE_URL}libs/brython/brython.html`,
});
const { promise, resolve } = Promise.withResolvers();
iframe.onload = (event) => resolve();
await promise;
//const iframe_window = iframe.contentWindow;
const iframe_document = iframe.contentDocument;
//console.dir(iframe_window)
//const __BRYTHON__ = iframe_window.__BRYTHON__;
//console.dir(__BRYTHON__)
//console.log(__BRYTHON__.python_to_js)

/* TODO
- Make part of a brython singleton */
const run_python = (text) => {
  const script = component.script({
    type: "text/python",
    innerHTML: text,
    parent: iframe_document.body,
  });
  script.remove()
};

/* Test */
run_python("print('Hello from Brython')");
//
//

/* NOTE Do NOT await import! */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}
