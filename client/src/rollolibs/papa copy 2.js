/*
"@/rollolibs/papa.js"
20250523
v.1.1
*/

import { component } from "@/rollo/component/component.js";

import { factory } from "@/rollolibs/tools/factory.js";

if (import.meta.env.DEV) {
  console.info("Loading PapaParse...");
}

const iframe = await factory();

const { promise, resolve } = Promise.withResolvers();

const script = component.script({
  onload: (event) => resolve(),
  src: `${import.meta.env.BASE_URL}rollolibs/papa/main.js`,
  parent: iframe.contentDocument.head
});
await promise;

export const Papa = iframe.contentWindow.Papa;

iframe.remove();
