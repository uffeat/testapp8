import { component } from "@/rollo/component/component.js";

//
//
console.log("Loading Brython...");
/*
const script = component.script({
  parent: document.head,
  src: `${import.meta.env.BASE_URL}libs/brython/core.js`,
});
const {promise, resolve} = Promise.withResolvers()
script.onload = (event) => resolve()
await promise
console.dir(window)
*/

/*
const response = await fetch(
  `${import.meta.env.BASE_URL}libs/brython/brython.html`
);
const srcdoc = await response.text();
*/

const iframe = component.iframe({
  parent: document.head,
  src:  `${import.meta.env.BASE_URL}libs/brython/foo.html`,
});
const { promise, resolve } = Promise.withResolvers();
iframe.onload = (event) => resolve();
await promise;
const iframe_window = iframe.contentWindow
console.dir(iframe_window)



//
//

/* NOTE Do NOT await import! */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}
