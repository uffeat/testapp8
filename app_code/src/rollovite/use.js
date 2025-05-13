/*
import { use } from "@/rollovite/use.js";
20250513
v.1.0
*/

const config = {
  default: {
    registry: import.meta.glob([
      "/src/**/*.css",
      "/src/**/*.js",
      "/src/**/*.json",
      "!/src/rollotest/**/*.*",
    ]),
    types: new Set(["css", "js", "json"]),
  },
  raw: {
    registry: import.meta.glob(
      ["/src/**/*.html", "/src/**/*.sheet", "!/src/rollotest/**/*.*"],
      { query: "?raw", import: "default" }
    ),
    types: new Set(["html", "sheet"]),
  },
};

export const use = async (path) => {
  const type = path.split(".").reverse()[0];

  if (path.startsWith("@/")) {
    path = `/src/${path.slice("@/".length)}`;

    let load;

    if (config.default.types.has(type)) {
      load = config.default.registry[path];
    } else if (config.raw.types.has(type)) {
      load = config.raw.registry[path];
    }

    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }

    return await load();
  }

  /* Import from public */
  path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  if (type === 'js') {
    return await pub.import(path);
  }



  return await pub.fetch(path);
};

const pub = new (class {
  #fetch;
  #import;

  constructor() {
    const owner = this;

    this.#fetch = new (class {
      #registry = new Map();
      async get(path) {
        let text = this.#registry.get(path);
        if (text) {
          return text;
        }
        const response = await fetch(path);
        text = (await response.text()).trim();
        this.#registry.set(path, text);
        return text;
      }
    })();

    const import_ = (url) => {
      return new Function(`return import("${url}")`)();
    };

    const construct = async (text) => {
      const blob = new Blob([text], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const module = await new Function(`return import("${url}")`)();
      URL.revokeObjectURL(url);
      return module;
    }

    this.#import = new (class {
      #registry = new Map();
      async get(path) {
        let module = this.#registry.get(path);
        if (module) {
          return module;
        }
        const text = await owner.fetch(path);
        module = await construct(`${text}\n//# sourceURL=${path}`)
        this.#registry.set(path, module);
        return module;
      }
    })();
  }

  async fetch(path) {
    return await this.#fetch.get(path);
  }

  async import(path) {
    return await this.#import.get(path);
  }

  
})();
