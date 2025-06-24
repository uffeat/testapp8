/*
import "@/app.js";
*/

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

const App = author(
  class extends base() {
    static __key__ = "rollo-app";

    constructor() {
      super();
      this.id = "app";
    }
  }
);

export const app = App({ id: "app", parent: document.body });

Object.defineProperty(window, "app", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: app,
});
