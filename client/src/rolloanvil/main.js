/*
import { main } from "@/rolloanvil/main.js";
*/

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





