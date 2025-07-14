/*
import { main } from "@/rolloanvil/main.js";
*/

/* TODO
- timeout */

import { meta } from "@/rollometa/meta.js";
import { component } from "@/rollocomponent/component.js";

export const main = new (class {
  #_ = {
    loaders: new Map(),
  };

  constructor() {
    const owner = this;

    this.#_.Submission = new (class {
      #_ = {
        submission: 0,
      };

      create() {
        return this.#_.submission++;
      }
    })();

    this.#_.iframe = component.iframe({
      parent: document.head,
      src: meta.anvil.origin,
    });

    /* receivers */
    this.#_.receivers = new (class {
      #_ = {
        registry: new Map(),
      };
      constructor() {}

      /* */
      get size() {
        return this.#_.registry.size;
      }

      /* */
      add(effect, condition) {
        this.#_.registry.set(effect, condition);
        return effect;
      }

      /* */
      clear() {
        this.#_.registry.clear();
        return owner;
      }

      /* */
      remove(effect) {
        this.#_.registry.delete(effect);
        return owner;
      }
    })();
  }

  use(api) {
    api = api.slice(0, -".py".length);
    if (this.#_.loaders.has(api)) {
      return this.#_.loaders.get(api);
    }

    const loader = async (data) => {
      if (!this.#_.loaded) {
        this.#_.loaded = true;
        await this.#load();

        console.log("Iframe loaded."); ////
      }
      return this.#call(api, data);
    };

    this.#_.loaders.set(api, loader);
    return loader;
  }

  #call(api, data) {
    const submission = this.#_.Submission.create();
    const { promise, resolve } = Promise.withResolvers();

    function onmessage(event) {
      if (event.origin !== meta.anvil.origin) {
        return;
      }
      if (event.data.submission !== submission) {
        return;
      }
      window.removeEventListener("message", onmessage);
      resolve(event.data.result);
    }

    window.addEventListener("message", onmessage);
    this.#_.iframe.contentWindow.postMessage(
      { api, data, submission },
      meta.anvil.origin
    );

    return promise;
  }

  #load() {
    const { promise, resolve } = Promise.withResolvers();
    this.#_.iframe.on.load$once = (event) => {
      resolve();
    };
    return promise;
  }
})();
