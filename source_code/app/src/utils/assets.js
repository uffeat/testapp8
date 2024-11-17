import manifest from "@/public/assets/manifest";
import { create } from "@/utils/component";

/* Exploit that Vite serves assets in 'public' as-is */
let base;
if (import.meta.env.DEV) {
  base = "/";
} else {
  base = import.meta.env.BASE_URL;
}

/* Util for serving (public) native assets in a way that by-passes Vite 
transformation/bundling and for serving (public) synthetic assets not 
supported by Vite. */
export const assets = new (class Asset {
  #bindings = {};
  #cache = {};
  bind = (handler, ...suffixes) => {
    for (const suffix of suffixes) {
      this.#bindings[suffix] = handler;
    }
  };

  /* Return (cached) asset or (uncached) asset as text. */
  get = async (path, { text = false } = {}) => {
    /* NOTE Importing asset as text can be useful, when a serialized version 
    of the asset is needed, e.g. for storage of sending over the wire. 
    Such serailized asset can later be brought to life with,
    e.g., construct_htmlx. consuming code must deal with caching, if required. */
    if (text) {
      return await import_txt(path);
    }
    /* Default to htmlx */
    if (!path.includes(".")) {
      path = `${path}.htmlx.html`;
    }

    if (path in this.#cache) {
      return this.#cache[path];
    }

    let asset;
    if (path in manifest) {
      asset = await construct_module(await import_txt(`${path}.js`, false));
    } else {
      const arr = path.split(".");
      const suffix = arr.pop();
      const key = arr.join(".");
      const handler = this.get_handler(suffix);
      if (!handler) {
        throw new Error(`Unsupported asset type: ${suffix}`);
      }
      asset = await handler(key);
    }

    this.#cache[path] = asset;
    return asset;
  };

  get_handler = (suffix) => {
    return this.#bindings[suffix];
  };
})();

/* Add 'assets' to global namespace, to provide import capabilities 
inside public assets. 
NOTE Limitations:
Public assets can only import other public assets. If other assets are needed, 
export functions that allow dependency injection.
*/
Object.defineProperty(window, "assets", {
  configurable: true,
  enumerable: false,
  writable: false,
  value: assets,
});

/* Retuns (uncached!) js module constucted from html using the html syntax. */
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

/* Returns (uncached!) js module created from text. */
async function construct_module(js) {
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  /* Wrap import in Function to prevent Vite from barking over the dynamic import */
  const js_module = await new Function(`return import("${url}")`)();
  URL.revokeObjectURL(url);
  return js_module;
}

/* Returns (uncached!) sheet constructed from text. */
function construct_sheet(css) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
}

/* Returns (uncached!) constructed sheet. */
async function import_css(key) {
  return construct_sheet(await import_txt(`${key}.css`));
}

/* Returns (uncached!) html or js module derived from htmlx asset. */
async function import_html(key) {
  let asset = await import_txt(`${key}.html`);
  if (key.endsWith(".htmlx")) {
    asset = await construct_htmlx(asset, `${key}.htmlx`);
  }
  return asset;
}

/* Returns (uncached!) js module. */
async function import_js(key) {
  return await construct_module(await import_txt(`${key}.js`));
}

/* Returns (uncached!) asset as text. */
async function import_txt(path, raw = true) {
  return await (
    await fetch(`assets/${raw ? "raw" : "built"}/${base}${path}`)
  ).text();
}

assets.bind(import_css, "css");
assets.bind(import_html, "html");
assets.bind(import_js, "js");
assets.bind(import_txt, "svg", "txt");
