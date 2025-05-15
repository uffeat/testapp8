/* TODO
- Actively use rollometa/__manifest__.json. 
  This file is now actively maintain and should be used to enable batch imports */



/* Utility for importing public files. 
NOTE
- Part of Rollo's import system.
- Intended as a slightly more low-level and therefore kept very compact.
- '__manifest__.js' can be used to compensate for the sligtly reduced 
  feature set for public imports (likely not relevant). */
export const assets = new (class {
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

    const construct = async (text) => {
      const blob = new Blob([text], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const module = await new Function(`return import("${url}")`)();
      URL.revokeObjectURL(url);
      return module;
    };

    this.#import = new (class {
      #registry = new Map();
      async get(path) {
        let module = this.#registry.get(path);
        if (module) {
          return module;
        }
        const text = await owner.fetch(path);
        module = await construct(`${text}\n//# sourceURL=${path}`);
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
