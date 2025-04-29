export const module = new (class Module {

  /* Returns a JS module constructed from text. 
  NOTE
  - Any caching should be handled in consuming code. */
  async from_text(text) {
    const blob = new Blob([text], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const module = await this.import(url);
    URL.revokeObjectURL(url);
    return module;
  }


  /* Returns promise resolved to JS module imported from url. 
  NOTE
  - By-passes Vite's barking at dynamic imports.
  - In contrast to the native 'import', 'import_' does (intentionally) NOT cache.
    Any caching should be handled in consuming code. */
  import(url) {
    return new Function(`return import("${url}")`)();
  }


})();


