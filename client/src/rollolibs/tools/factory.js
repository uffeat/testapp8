/*
import { factory } from "@/rollolibs/tools/factory.js";
20250523
v.1.0
*/

import { component } from "@/rollo/component/component.js";

const srcdoc = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body></body></html>`;

/* Creates iframe and adds it to document head. 
Optionally, injects scripts from urls. 
Returns iframe, once fully loaded. */
export const factory = async (...urls) => {
  const { promise, resolve } = Promise.withResolvers();
  const iframe = component.iframe({
    parent: document.head,
    onload: (event) => resolve(),
    srcdoc,
  });
  await promise;
  /* Inject scripts */
  for (const url of urls) {
    const { promise, resolve } = Promise.withResolvers();
    component.script({
      parent: iframe.contentDocument.head,
      onload: (event) => resolve(),
      src: `${import.meta.env.BASE_URL}${url}`,
    });
    await promise;
  }

  return iframe;
};
