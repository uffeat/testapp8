/*
"@/rollolibs/papa.js"
20250523
v.1.1
*/



console.log(location.origin)

/* Create and add iframe with scripts injected */
const { promise, resolve } = Promise.withResolvers();
const iframe = component.iframe({
  parent: document.head,
  src: `${location.origin}/rollolibs/papa/main.html`,
  
});

iframe.onload = (event) => resolve()

await promise;

const Papa = iframe.contentWindow.Papa

iframe.remove()

export { Papa };
