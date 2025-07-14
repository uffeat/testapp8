/*
import { AnvilLoaders } from "@/rolloanvil/main.js";
*/

/* TODO
- timeout */

import { meta } from "@/rollometa/meta.js";
import { component } from "@/rollocomponent/component.js";

const Submission = new (class {
  #_ = {
    submission: 0,
  };

  create() {
    return this.#_.submission++;
  }
})();

const iframe = component.iframe({
  parent: document.head,
  src: meta.anvil.origin,
  '[anvil]': "production" ? "production" : "development",
  '[main]': true,
});



await (() => {
  const { promise, resolve } = Promise.withResolvers();
  iframe.on.load$once = (event) => {
    iframe.attribute.loaded = true;
    resolve();
  };
  return promise;
})();

const call = (api, data) => {
  const submission = Submission.create();
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
  iframe.contentWindow.postMessage(
    { api, data, submission },
    meta.anvil.origin
  );

  return promise;
};

export const AnvilLoaders = new (class {
  #_ = {
    registry: new Map(),
  };

  create(api) {
    api = api.slice(0, -".py".length);
    if (this.#_.registry.has(api)) {
      return this.#_.registry.get(api);
    }

    const loader = (data) => {
      return call(api, data);
    };

    this.#_.registry.set(api, loader);
    return loader;
  }
})();

export const Receivers = new (class {
  #_ = {
    registry: new Set(),
  };
  constructor() {
    window.addEventListener("message", async (event) => {
      if (event.origin !== meta.anvil.origin) {
        return;
      }
      if (!event.data.signal) {
        return;
      }
      if (!Receivers.size) {
        return;
      }
      for (const effect of this.effects()) {
        await effect(event.data.data);
      }
    });
  }

  /* */
  get size() {
    return this.#_.registry.size;
  }

  /* */
  add(effect) {
    this.#_.registry.add(effect);
    return effect;
  }

  /* */
  clear() {
    this.#_.registry.clear();
    return this;
  }

  /* */
  effects() {
    return this.#_.registry.values();
  }

  /* */
  remove(effect) {
    this.#_.registry.delete(effect);
    return this;
  }
})();


