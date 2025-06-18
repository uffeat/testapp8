/*
import { components } from "@/rollocomponent/tools/components.js";
20250617
v.1.1
*/

/* TODO 
- Currently, html (templates) are just raw string. Consider implmenting a Template class 
  (or perhaps component) that can make post-processing easier, and/or create
  a parser that converts template elements to basic Rollo components.
- Consider deep integration into 'use' rather than using a local import maps.
*/

import { author } from "@/rollocomponent/tools/author.js";
import { construct } from "@/rollovite/_tools/construct.js";
import { component } from "@/rollocomponent/component.js";
//const { Sheet } = await use("@/rollosheet/");
import { Sheet } from "@/rollosheet/tools/sheet.js";

/* Returns instance factory for web component. */
export const components = new (class {
  #_ = {
    cache: new Map(),
    css: import.meta.glob(["/src/components/**/*.css"], {
      query: "?raw",
      import: "default",
    }),
    html: import.meta.glob(["/src/components/**/*.html"], {
      query: "?raw",
      import: "default",
    }),
    js: import.meta.glob(["/src/components/**/*.js"]),
  };

  /** */
  async import(key) {
    /* Allow skipping .html */
    if (!key.endsWith("/") && !key.endsWith(".html")) {
      key = `${key}.html`;
    }
    /* Check cache */
    if (this.#_.cache.has(key)) {
      return this.#_.cache.get(key);
    }

    const assets = {};
    let module;

    if (key.endsWith("/")) {
      /* Create parcel component */

      /* NOTE In contrast to SFCs, asset names include file type.
      Example: sheet.css */

      /* Build sheet assets */
      for (const path of Object.keys(this.#_.css)) {
        if (path.startsWith(`/src/components/${key}`)) {
          const load = this.#_.css[path];
          const text = await load();
          const name = path.slice(`/src/components/${key}assets`.length + 1);
          /* NOTE Sheet name should be short an unique. For parcel components
          uniqueness is achieved by deriving the name from the path of the asset
          (taking advantage of the standard placement in an 'assets' dir).
          Example: stuff/sheet */
          const sheet = new Sheet(text, {
            name: `${key}${name.slice(0, -".css".length)}`,
          });
          assets[name] = sheet;
          /* NOTE In contrast to SFCs, global sheets are NOT automatically 
          handled for parcel components, but should be made global in 
          __init__.js, e.g.:
            assets["sheet.css"].adopt(document); 
          */
        }
      }
      /* Build template assets */
      for (const path of Object.keys(this.#_.html)) {
        if (path.startsWith(`/src/components/${key}`)) {
          const load = this.#_.html[path];
          const text = await load();
          assets[path.slice(`/src/components/${key}assets`.length + 1)] = text;
        }
      }
      /* Get module */
      const load = this.#_.js[`/src/components/${key}__init__.js`];
      module = await load();
    } else {
      /* Create SFC component */

      /* Get html */
      const path = `/src/components/${key}`;
      const load = this.#_.html[path];
      const html = await load();

      const wrapper = component.div({ innerHTML: html });

      /* Build sheet assets */
      for (const element of wrapper.querySelectorAll("style[name]")) {
        /* NOTE Only handled named styles, so that unnamed styles inside 
        templates are not handled. */
        const name = element.getAttribute("name");
        /* NOTE Sheet name should be short an unique. For SFCs
        uniqueness is achieved by deriving the name from the path of the SFC
        combined with the asset name. The inclusion of '.html' avoids
        name collisions with respect to parcel component sheets.
        Example: foo.html/hot */
        const sheet = new Sheet(element.textContent, {
          name: `${key}/${name}`,
        });
        assets[name] = sheet;
        /* Handle global styles */
        if (element.hasAttribute("global")) {
          sheet.adopt(document);
        }
      }
      /* Build template assets */
      for (const element of wrapper.querySelectorAll("template")) {
        if (!element.hasAttribute("name")) {
          throw new Error(`Unnamed template.`);
        }
        const name = element.getAttribute("name");
        const html = element.innerHTML;
        assets[name] = html;
      }

      /* Get module */
      const script = wrapper.querySelector("script");
      const js = script.textContent;
      module = await construct(js);
    }

    /* Get cls */
    const cls = await module.default(Object.freeze(assets), {
      components: this,
    });

    const factory = author(cls);

    /* Expose component assets.
    NOTE Strictly speaking, only necessary for SFCs, but also implemented for 
    parcel components - for consistency and convenience. */
    Object.defineProperty(factory, "__assets__", {
      configurable: false,
      enumerable: true,
      writable: false,
      value: assets,
    });

    this.#_.cache.set(key, factory);
    return factory;
  }
})();
