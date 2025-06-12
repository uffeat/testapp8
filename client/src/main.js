/*
main.js
20250520
*/

/* Globals */
import "@/bootstrap.scss";
import "@/main.css";
import "@/rollovite/__init__.js";

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
    return this.text
  }
}

const map = import.meta.glob(["/src/components/**/*.html"], {
  query: "?raw",
  import: "default",
});

console.log('paths:', Object.keys(map))

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


    //
    //
    const path = `/src/components/${key}`;
    //
    //

    const load = map[path];
    const html = await load();

    //console.log('html:', html)////

    const wrapper = component.div({ innerHTML: html });

    /* Get cls */
    const script = wrapper.find("script");
    const js = script.textContent;
    //console.log('js:', js)////
    const module = await construct(js);
    //console.log('module:', module)////
    const cls = module.default;
    //console.log('cls:', cls)////

    // TODO Handle scoped and shadow sheets and templates

    const result = author(cls);
    this.#_.cache.set(key, result);

    /* Handle global style */
    const global_style = wrapper.find("style[global]");
    if (global_style) {
      const css = global_style.textContent;
      ////console.log('css:', css)////
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      document.adoptedStyleSheets.push(sheet);
    }

    /* Handle assets */
    cls.__assets__ = {};
    for (const element of wrapper.querySelectorAll('style[name]')) {
      //console.log('element:', element)//
      console.log('text:', element.textContent)
      console.log('name:', element.getAttribute('name'))
     
     cls.__assets__[element.getAttribute('name')] = new Sheet(element.textContent)//
      
    }

   


    for (const element of wrapper.querySelectorAll('template[name]')) {
     cls.__assets__[element.getAttribute('name')] = element.innerHTML
      
    }

    return result;
  }
})();

const MyComponent = await components.import("my_component.html");

const my_component = MyComponent({ parent: document.body });

/* NOTE Do NOT await import! */
if (import.meta.env.VERCEL_ENV === "production") {
  import("@/main/production/main.js");
} else if (import.meta.env.VERCEL_ENV === "preview") {
  import("@/main/preview/main.js");
} else {
  import("@/main/development/main.js");
}
