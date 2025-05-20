/*
import "@/rollovite/__init__.js";
import { use } from "@/rollovite/__init__.js";
20250520
v.4.0
*/

import { app } from "@/rollovite/tools/_app.js";

/* Unviversal import utility.
NOTE
- The central piece of the Rollo import engine API.
- Really no need to export, since aded to global namespace, but explicit import
  can silence barking linters. */
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