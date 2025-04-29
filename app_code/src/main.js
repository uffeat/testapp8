import { component } from "@/rollo/component/component.js";

//
//
console.log('Loading Brython...')
const script = component.script({
  parent: document.head,
  src: `${import.meta.env.BASE_URL}libs/brython/core.js`,
});
const {promise, resolve} = Promise.withResolvers()
script.onload = (event) => resolve()
await promise
console.dir(window)
//
//

/* NOTE Do NOT await import! */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}