/*
import "@/rolloapp/__init__.js";
*/
import "@/rolloapp/_assets/main.css";
import { app } from "@/rolloapp/_app.js";
import "@/rolloapp/_config/__init__.js";


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
