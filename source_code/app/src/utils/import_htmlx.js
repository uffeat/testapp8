import { create } from "@/utils/component";

let base;
if (import.meta.env.DEV) {
  base = "/";
} else {
  base = import.meta.env.BASE_URL;
}

const cache = {};

export async function import_htmlx(path) {
  if (path in cache) {
    return cache[path];
  }
  const innerHTML = await import_html(path);
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

  const asset = await construct_module(js)
  cache[path] = asset;
  return asset;
}

async function import_html(path) {
  const response = await fetch(`${base}${path}.html`);
  const html = await response.text();
  return html;
}

async function construct_module(js) {
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const js_module = await new Function(`return import("${url}")`)();
  URL.revokeObjectURL(url);
  return js_module;
}
