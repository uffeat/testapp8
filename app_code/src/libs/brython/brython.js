import { component } from "@/rollo/component/component.js";
import { modules } from "@/rollovite/modules.js";

console.log("Loading Brython...");

const iframe_window = await (async () => {
  /* Create iframe with Bryton stuff */
  component.iframe({
    parent: document.head,
    src: `${import.meta.env.BASE_URL}libs/brython/brython.html`,
  });
  /* Wait until Bryton has initialized */
  const { promise, resolve } = Promise.withResolvers();
  const on_brython = (event) => {
    resolve(event.detail);
    window.removeEventListener("brython", on_brython);
  };
  window.addEventListener("brython", on_brython);
  const iframe_window = await promise;
  return iframe_window;
})();

/* Controller for Brython. */
export const brython = new (class Brython {
  /* TODO
  - Get result from run Python scripts */

  #__BRYTHON__;
  #config;
  constructor() {
    this.#__BRYTHON__ = Object.freeze(iframe_window.__BRYTHON__);
    //console.dir( this.#__BRYTHON__)
    this.#config = new (class Config {
      #delay = 100;

      /* Returns time in ms before exec script is moved. */
      get delay() {
        return this.#delay;
      }

      /* Sets time in ms before exec script is moved. */
      set delay(delay) {
        this.#delay = delay;
      }
    })();
  }

  /* Returns original __BRYTHON__ object. */
  get __BRYTHON__() {
    return this.#__BRYTHON__;
  }

  /* Returns config controller. */
  get config() {
    return this.#config;
  }

  /* Runs Python code from text. 
  NOTE
  - Simulates the cannonical old-school way of running Python with Brython: 
    Python code in a script tag maked with type="text/python" */
  run(text) {
    const script = component.script({
      type: "text/python",
      innerHTML: text,
      parent: iframe_window.document.body,
    });
    /* Remove script tag to avoid clutter
    XXX
    - The delay is arbitrary (= not ideal), but can at least be set via config */
    setTimeout(() => script.remove(), this.config.delay);
  }
})();
