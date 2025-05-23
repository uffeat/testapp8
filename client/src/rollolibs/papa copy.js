/*
"@/rollolibs/papa.js"
20250522
v.1.0
*/

import { component } from "@/rollo/component/component.js";

if (import.meta.env.DEV) {
  console.info("Loading PapaParse...");
}

const { promise, resolve } = Promise.withResolvers();
const iframe = component.iframe({
  parent: document.head,
  onload: (event) => resolve(),
  src: `${import.meta.env.BASE_URL}rollolibs/papa/main.html`,
});
await promise;



export const Papa = iframe.contentWindow.Papa;

iframe.remove()
