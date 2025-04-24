export const modules = new (class Modules {
  #base;

  constructor() {
   
    this.#base = `${location.origin}/theme/assets/src`;
  }

  async get(path, { raw = false } = {}) {
    if (path.startsWith('@')) {
      path = `${this.#base}${path.slice(1)}`
      
    }


    const [type, format] = this.#get_extensions(path);

    if (type === "js") {
      const module = await import(path);
      return module;
    }
  }

  #get_extensions(path) {
    const extentions = (() => {
      const parts = path.split("/");
      const [last, ..._] = parts.toReversed();
      if (last.includes(".") && !last.startsWith(".")) {
        const [_, ...extentions] = last.split(".");
        return extentions;
      }
    })();
    if (extentions) {
      const [type, format] = extentions.toReversed();
      return Object.freeze([type, format || null]);
    }
    return Object.freeze([null, null]);
  }
})();

window.modules = modules;
