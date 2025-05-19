/*
import "@/rollovite/__init__.js";
import { use } from "@/rollovite/__init__.js";
20250519
v.1.0
*/

import { app } from "@/rollovite/tools/_app.js";

export const use = new Proxy(() => {}, {
  get: (target, key) => {
    return app[key];
  },

  apply: (target, context, args) => {
    return app.import(...args);
  },
});

/* Make 'use' global */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: use,
});