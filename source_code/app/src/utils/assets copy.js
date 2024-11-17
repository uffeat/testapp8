import { create } from "@/utils/component";

let base;
if (import.meta.env.DEV) {
  base = "/";
} else {
  base = import.meta.env.BASE_URL;
}

/* NOTE . */

/* Util for serving assets */
export const assets = new (class Asset {
  #cache = {};
  get = async (path) => {
    if (!path.includes(".")) {
      path = `${path}.htmlx.html`;
    }

    if (path in this.#cache) {
      return this.#cache[path];
    }

    const arr = path.split(".");
    const suffix = arr.pop();
    const key = arr.join(".");

    let asset;
    if (suffix === "css") {
      asset = await import_css(key);
    } else if (suffix === "js") {
      asset = await import_js(key);
    } else if (suffix === "html") {
      if (key.endsWith(".htmlx")) {
        asset = await import_htmlx(key);
      } else {
        asset = await import_html(key);
      }
    } else {
      throw new Error(`Unsupported asset type: ${suffix}`);
    }

    this.#cache[path] = asset;
    return asset;
  };
})();

/* Add 'assets' to global namespace, to provide import capabilities 
inside htmlx script tags. */
Object.defineProperty(window, "assets", {
  configurable: true,
  enumerable: false,
  writable: false,
  value: assets,
});

async function construct_module(js) {
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  /* Wrap import in Function to prevent Vite from barking over the dynamic import */
  const js_module = await new Function(`return import("${url}")`)();
  URL.revokeObjectURL(url);
  return js_module;
}

function construct_sheet(css) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
}

async function import_css(key) {
  const css = await import_txt(`${key}.css`);
  return construct_sheet(css);
}

async function import_html(key) {
  const html = await import_txt(`${key}.html`);
  return html;
}

async function import_htmlx(key) {
  const innerHTML = await import_txt(`${key}.html`);
  const wrapper = create("div", { innerHTML });
  const assets = [
    ...wrapper
      .get_elements("template[name]")
      .map(
        (element) =>
          `${
            element.hasAttribute("export") ? "export " : ""
          }const ${element.getAttribute("name")} = ${JSON.stringify(
            element.innerHTML.trim()
          )};`
      ),
    ...wrapper.get_elements("style[name]").map((element) => {
      const name = element.getAttribute("name");
      const css = JSON.stringify(element.textContent.trim());
      return `${
        element.hasAttribute("export") ? "export " : ""
      }const ${name} = new CSSStyleSheet();${name}.replaceSync(${css});`;
    }),
  ];
  /* Inject assets into js, so that constructed module has direct access to 
  same-file assets. */
  let js = assets.length === 0 ? "" : assets.join("\n");
  const script = wrapper.querySelector("script");
  if (script) {
    js += script.textContent.trim();
  }
  js += `\n//# sourceURL=${key}.htmlx`;
  return await construct_module(js);
}

async function import_js(key) {
  const js = await import_txt(`${key}.js`);
  return await construct_module(js);
}

async function import_txt(path) {
  const response = await fetch(`assets/raw/${base}${path}`);
  const txt = await response.text();
  return txt;
}
