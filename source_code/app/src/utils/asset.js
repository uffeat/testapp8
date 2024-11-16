import { create } from "@/utils/component";

let base;
if (import.meta.env.DEV) {
  base = "/";
} else {
  base = import.meta.env.BASE_URL;
}



async function import_htmlx(path) {
  
  const innerHTML = await import_txt(path);
  const wrapper = create("div", { innerHTML });
  const assets = [
    ...wrapper
      .get_elements("template[name]")
      .map(
        (element) =>
          `const ${element.getAttribute("name")} = ${JSON.stringify(
            element.innerHTML.trim()
          )};`
      ),
    ...wrapper.get_elements("style[name]").map((element) => {
      const name = element.getAttribute("name");
      const css = JSON.stringify(element.textContent.trim());
      return `const ${name} = new CSSStyleSheet();${name}.replaceSync(${css});`;
    }),
  ];
  let js = assets.length === 0 ? "" : assets.join("\n");
  const script = wrapper.querySelector("script");
  if (script) {
    js += script.textContent.trim();
  }
  js += `\n//# sourceURL=${path}`;

  console.log(js);

  let asset = await construct_module(js)

  console.dir(asset)
  
  return asset;
}

async function import_txt(path) {
  const response = await fetch(`raw/${base}${path}.html`);
  const txt = await response.text();
  return txt;
}

async function construct_module(js) {
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const js_module = await new Function(`return import("${url}")`)();
  URL.revokeObjectURL(url);
  return js_module;
}

async function import_js(path) {
  return await new Function(`return import("./${path}.js")`)();
}

export const asset = new(class Asset {
  #cache = {}
  get = async (path) => {
    if (path in this.#cache) {
      return this.#cache[path];
    }



    const arr = path.split('.')
    const suffix = arr.pop()
    const key = arr.join('.')

    

    let asset
    if (suffix === 'htmlx') {
      asset = import_htmlx(key)
      
    }

    this.#cache[path] = asset
    return asset

  }
})
