import { create } from "@/utils/component";

/* Exploit that Vite serves assets in 'public' as-is */
let base;
if (import.meta.env.DEV) {
  base = "/";
} else {
  base = import.meta.env.BASE_URL;
}

/* Util for serving native assets in a way that by-passes Vite transformations
and for serving synthetic assets not supported by Vite. */
export const assets = new (class Asset {
  #bindings = {};
  #cache = {};
  bind = (handler, ...suffixes) => {
    for (const suffix of suffixes) {
      this.#bindings[suffix] = handler;
    }
  };

  get = async (path, {text = false} = {}) => {
    if (text) {
      return await import_txt(path)
    }
    /* Default to htmlx */
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
    const handler = this.#bindings[suffix];
    if (!handler) {
      throw new Error(`Unsupported asset type: ${suffix}`);
    }
    asset = await handler(key);
    this.#cache[path] = asset;
    return asset;
  };
})();

/* Add 'assets' to global namespace, to provide import capabilities 
inside public assets. */
Object.defineProperty(window, "assets", {
  configurable: true,
  enumerable: false,
  writable: false,
  value: assets,
});

async function construct_htmlx(html, sourceURL) {
  const wrapper = create("div", { innerHTML: html });
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
    if (sourceURL) {
      js += `\n//# sourceURL=${sourceURL}`;
    }
    
    return await construct_module(js);
}

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
  return construct_sheet((await import_txt(`${key}.css`)));
}

/* Returns html or js module derived from htmlx asset. */
async function import_html(key) {
  let asset = await import_txt(`${key}.html`);
  if (key.endsWith(".htmlx")) {
    asset = await construct_htmlx(asset, `${key}.htmlx`)


    
  } 
  return asset;
}

/* Returns js module in a way that escapes Vite transformation/bundling. */
async function import_js(key) {
  return await construct_module((await import_txt(`${key}.js`)));
}

/* Returns asset as text. */
async function import_txt(path) {
  return await (await fetch(`assets/raw/${base}${path}`)).text();
}

assets.bind(import_css, "css");
assets.bind(import_html, "html");
assets.bind(import_js, "js");
assets.bind(import_txt, "svg", "txt");
