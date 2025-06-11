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
import { WebComponent } from "@/rollocomponent/web_component.js";


class Sheet extends CSSStyleSheet {
  #_ = {
    targets: new Set(),
  };

  constructor(text) {
    super();
    if (text) {
      this.replaceSync(text)
      this.#_.text = text
    }
  }

  get text() {
    return this.#_.text
  }

  adopt(target) {
    if (this.#_.targets.has(target)) {
      this.#_.targets.add(target)
      target.adoptedStyleSheets.push(this)
    }
     return this
  }
 
}

const map = import.meta.glob(["/src/components/**/*.html"], {
  query: "?raw",
  import: "default",
});

const components = new (class {
  #_ = {
    cache: new Map(),
  };
  async import(key) {
    if (!key.endsWith('.html')) {
      key = `${key}.html`
    }
    if (this.#_.cache.has(key)) {
      return this.#_.cache.get(key)
    }
    const path = `/src/components/${key}`

    const load = map[path]
    const html = await load()

    //console.log('html:', html)////

    const wrapper = component.div({innerHTML: html})

    const script = wrapper.find('script')

    const js = script.textContent

    //console.log('js:', js)////

    const module = await construct(js)

    //console.log('module:', module)////

    const cls = module.default

    //console.log('cls:', cls)////

    // TODO Handle scoped and shadow sheets and templates





    const result = author(cls)
    this.#_.cache.set(key, result)


    const global_style = wrapper.find('style[global]')
    if (global_style) {
      const css = global_style.textContent
       ////console.log('css:', css)////
       const sheet = new CSSStyleSheet()
       sheet.replaceSync(css)
       document.adoptedStyleSheets.push(sheet)

      
    }

    return result




  }
})();

const MyComponent = await components.import('my_component.html')

const my_component = MyComponent({parent: document.body})