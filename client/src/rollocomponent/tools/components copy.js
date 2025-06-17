/*
import { components } from "@/rollocomponent/tools/components.js";
20250616
v.1.0
*/

/* TODO 
- PERHAPS... A version that supports js and auto-import/injection of files in sub dirs. 
  Same idea re a default func tht receives assets + a way to handle global sheets.
- Currently, html (templates) are just raw string. Consider implmenting a Template class 
  (or perhaps component) that can make post-processing easier (currently, potentially verbose) 
- Consider deep integration into 'use' rather than using a local import map.
- Add "docstrings"...
  */

import { author } from "@/rollocomponent/tools/author.js";
import { construct } from "@/rollovite/_tools/construct.js";
import { component } from "@/rollocomponent/component.js";
const { Sheet } = await use("@/rollosheet/");

const map = import.meta.glob(["/src/components/**/*.html"], {
  query: "?raw",
  import: "default",
});

export const components = new (class {
  #_ = {
    _assets: new Map(),
    assets: null,
    components: new Map(),
  };

  constructor() {
    const owner = this;
    this.#_.assets = new (class {
      async import(key) {
        await owner.import(key);
        return owner.#_._assets.get(key);
      }
    })();
  }

  get assets() {
    return this.#_.assets;
  }

  async import(key) {
    /* Allow skipping .html */
    if (!key.endsWith(".html")) {
      key = `${key}.html`;
    }
    /* Check cache */
    if (this.#_.components.has(key)) {
      return this.#_.components.get(key);
    }
    /* Get html */
    const path = `/src/components/${key}`;
    const load = map[path];
    const html = await load();

    const wrapper = component.div({ innerHTML: html });

    /* Build assets */
    const assets = {};
    const exports = {};
    /* Handle sheet assets */
    for (const element of wrapper.querySelectorAll("style")) {
      if (!element.hasAttribute("name")) {
        throw new Error(`Unnamed style.`);
      }
      const name = element.getAttribute("name");
      const sheet = new Sheet(element.textContent, { name: `${key}:name` });
      assets[name] = sheet;
      /* Handle exports */
      if (element.hasAttribute("export")) {
        exports[name] = sheet;
      }
      /* Handle global styles */
      if (element.hasAttribute("global")) {
        sheet.adopt(document);
      }
    }

    /* Handle template assets */
    for (const element of wrapper.querySelectorAll("template")) {
      if (!element.hasAttribute("name")) {
        throw new Error(`Unnamed template.`);
      }
      const name = element.getAttribute("name");
      const html = element.innerHTML;
      assets[name] = html;
      /* Handle exports */
      if (element.hasAttribute("export")) {
        exports[name] = html;
      }
    }

    Object.freeze(assets);

    if (Object.keys(exports).length) {
      this.#_._assets.set(key, Object.freeze(exports));
    }

    /* Get cls */
    const script = wrapper.querySelector("script");
    if (script) {
      const js = script.textContent;

      const module = await construct(js);
      const cls = await module.default(assets, { components: this });

      const result = author(cls);
      this.#_.components.set(key, result);

      return result;
    }
  }
})();
