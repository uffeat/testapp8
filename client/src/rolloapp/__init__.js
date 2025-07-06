/*
import "@/rolloapp/__init__.js";
*/



import "@/rolloapp/config/__init__.js";
import { component } from "@/rollocomponent/component.js";

await app.import('/rolloapp/assets/main.css')



Object.defineProperty(window, "component", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: component,
});



Object.defineProperty(window, "app", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: app,
});

Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: new Proxy(() => {}, {
    get: (_, key) => app[key],
    apply: (_, __, args) => app.import(...args),
  }),
});


await app.shadow.sheets.import("/rolloapp/assets/shadow");
