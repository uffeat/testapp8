/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

import { author } from "@/rollocomponent/tools/author.js";
import { construct } from "@/rollovite/_tools/construct.js";
import { component } from "@/rollocomponent/component.js";

class Sheet extends CSSStyleSheet {
  #_ = {
    targets: new Set(),
  };

  constructor(text) {
    super();
    if (text) {
      this.replaceSync(text);
      this.#_.text = text;
    }
  }

  get text() {
    return this.#_.text;
  }

  adopt(target) {
    if (this.#_.targets.has(target)) {
      this.#_.targets.add(target);
      target.adoptedStyleSheets.push(this);
    }
    return this;
  }

  toString() {
    return this.text;
  }
}

/* TODO Version that supports js and autoimport/injection of files in sub dirs. 
Same idea re a default func tht receives assets + a way to handle global sheets
  */

const map = import.meta.glob(["/src/components/**/*.html"], {
  query: "?raw",
  import: "default",
});

console.log("paths:", Object.keys(map));

const components = new (class {
  #_ = {
    cache: new Map(),
  };
  async import(key) {
    /* Allow skipping .html */
    if (!key.endsWith(".html")) {
      key = `${key}.html`;
    }
    /* Check cache */
    if (this.#_.cache.has(key)) {
      return this.#_.cache.get(key);
    }
    /* Get html */

    const path = `/src/components/${key}`;

    const load = map[path];
    const html = await load();

    //console.log('html:', html)////

    const wrapper = component.div({ innerHTML: html });

    /* Handle global style */
    (() => {
      const style = wrapper.find("style[global]");
      if (style) {
        const text = style.textContent;
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(text);
        document.adoptedStyleSheets.push(sheet);
      }
    })();

    /* Handle assets */
    const assets = {};
    for (const element of wrapper.querySelectorAll("style[name]")) {
      //console.log('element:', element)//
      console.log("text:", element.textContent);
      console.log("name:", element.getAttribute("name"));
      assets[element.getAttribute("name")] = new Sheet(element.textContent); //
    }

    for (const element of wrapper.querySelectorAll("template[name]")) {
      assets[element.getAttribute("name")] = element.innerHTML;
    }

    /* Get cls */
    const script = wrapper.find("script");
    const js = script.textContent;
    //console.log("js:", js); ////
    const module = await construct(js);
    //console.log('module:', module)////
    const cls = module.default(assets);
    //console.log('cls:', cls)////

    const result = author(cls);
    this.#_.cache.set(key, result);

    return result;
  }
})();

const MyComponent = await components.import("my_component.html");

const my_component = MyComponent({ parent: document.body });
